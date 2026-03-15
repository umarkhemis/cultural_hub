
import json
import secrets
import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.cultural_site import CulturalSite
from app.models.notification import NotificationType
from app.models.package import Package
from app.models.payment import Payment, PaymentGateway, PaymentRecordStatus
from app.models.user import User, UserRole
from app.modules.notifications.service import create_notification
from app.modules.payments.schema import MockWebhookRequest, PaymentInitializeRequest
from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


def _generate_reference() -> str:
    return f"TXN-{secrets.token_hex(12).upper()}"


def initialize_payment(db: Session, current_user: User, payload: PaymentInitializeRequest) -> Payment:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can initialize payments.")

    try:
        booking_uuid = uuid.UUID(payload.booking_id)
    except ValueError as exc:
        raise ValidationException("Invalid booking_id.") from exc

    booking = db.scalar(
        select(Booking)
        .options(joinedload(Booking.package).joinedload(Package.provider))
        .where(Booking.id == booking_uuid)
    )
    if not booking:
        raise NotFoundException("Booking not found.")

    if booking.tourist_id != current_user.id:
        raise ForbiddenException("You can only pay for your own booking.")

    if booking.payment_status == PaymentStatus.paid:
        raise ValidationException("This booking is already paid.")

    existing_active_payment = db.scalar(
        select(Payment).where(
            Payment.booking_id == booking.id,
            Payment.payment_status.in_([
                PaymentRecordStatus.initialized,
                PaymentRecordStatus.pending,
                PaymentRecordStatus.completed,
            ]),
        )
    )
    if existing_active_payment and existing_active_payment.payment_status == PaymentRecordStatus.completed:
        raise ValidationException("A completed payment already exists for this booking.")

    try:
        gateway = PaymentGateway(payload.payment_gateway)
    except ValueError as exc:
        raise ValidationException("Unsupported payment gateway.") from exc

    payment = Payment(
        booking_id=booking.id,
        amount=booking.total_price,
        currency=payload.currency.upper(),
        payment_gateway=gateway,
        payment_status=PaymentRecordStatus.initialized,
        transaction_reference=_generate_reference(),
        gateway_response=json.dumps(
            {
                "message": "Payment initialized successfully.",
                "checkout_url": f"https://mock-gateway.local/checkout/{booking.id}",
            }
        ),
    )
    db.add(payment)

    booking.payment_status = PaymentStatus.pending

    provider_user_id = db.scalar(
        select(CulturalSite.user_id).where(CulturalSite.id == booking.package.provider_id)
    )
    if provider_user_id:
        create_notification(
            db=db,
            user_id=provider_user_id,
            notification_type=NotificationType.new_booking_for_provider,
            title="New booking received",
            message=f"You received a new booking for {booking.package_title_snapshot}.",
            related_entity_id=str(booking.id),
        )

    create_notification(
        db=db,
        user_id=current_user.id,
        notification_type=NotificationType.booking_created,
        title="Booking created",
        message=f"Your booking for {booking.package_title_snapshot} has been created and is awaiting payment.",
        related_entity_id=str(booking.id),
    )

    db.commit()
    db.refresh(payment)
    return payment


def get_payment_detail_for_owner(db: Session, current_user: User, payment_id: uuid.UUID) -> Payment:
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking).joinedload(Booking.package))
        .where(Payment.id == payment_id)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    booking = payment.booking

    if current_user.role == UserRole.tourist and booking.tourist_id == current_user.id:
        return payment

    if current_user.role == UserRole.provider:
        site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == current_user.id))
        if site and booking.package.provider_id == site.id:
            return payment

    if current_user.role == UserRole.admin:
        return payment

    raise ForbiddenException("You do not have permission to view this payment.")


def process_mock_webhook(db: Session, payload: MockWebhookRequest) -> Payment:
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking).joinedload(Booking.package).joinedload(Package.provider))
        .where(Payment.transaction_reference == payload.transaction_reference)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    booking = payment.booking
    provider_site = booking.package.provider

    if payload.payment_status not in {"completed", "failed"}:
        raise ValidationException("payment_status must be 'completed' or 'failed'.")

    if payload.payment_status == "completed":
        payment.payment_status = PaymentRecordStatus.completed
        payment.gateway_response = payload.gateway_response
        booking.payment_status = PaymentStatus.paid
        booking.booking_status = BookingStatus.confirmed

        create_notification(
            db=db,
            user_id=booking.tourist_id,
            notification_type=NotificationType.payment_completed,
            title="Payment successful",
            message=f"Your payment for {booking.package_title_snapshot} was successful.",
            related_entity_id=str(booking.id),
        )

        provider_user_id = db.scalar(
            select(CulturalSite.user_id).where(CulturalSite.id == provider_site.id)
        )
        if provider_user_id:
            create_notification(
                db=db,
                user_id=provider_user_id,
                notification_type=NotificationType.booking_confirmed,
                title="Booking confirmed",
                message=f"A booking for {booking.package_title_snapshot} has been paid and confirmed.",
                related_entity_id=str(booking.id),
            )

    else:
        payment.payment_status = PaymentRecordStatus.failed
        payment.gateway_response = payload.gateway_response
        booking.payment_status = PaymentStatus.failed

        create_notification(
            db=db,
            user_id=booking.tourist_id,
            notification_type=NotificationType.payment_failed,
            title="Payment failed",
            message=f"Your payment for {booking.package_title_snapshot} failed. Please try again.",
            related_entity_id=str(booking.id),
        )

    db.commit()
    db.refresh(payment)
    return payment
