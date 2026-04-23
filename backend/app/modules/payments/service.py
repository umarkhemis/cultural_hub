
import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.notification import NotificationType
from app.models.payment import Payment, PaymentGateway
from app.models.user import User, UserRole
from app.modules.notifications.service import create_notification
from app.services import mtn_momo, flutterwave
from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _expire_booking_if_needed(db: Session, booking: Booking) -> Booking:
    now = _now()
    if (
        booking.booking_status == BookingStatus.awaiting_payment
        and booking.payment_status in [PaymentStatus.unpaid, PaymentStatus.pending, PaymentStatus.failed]
        and booking.reserved_until is not None
        and booking.reserved_until < now
    ):
        booking.booking_status = BookingStatus.expired
        db.add(booking)
        db.commit()
        db.refresh(booking)
    return booking


def _get_booking_for_payment(db: Session, booking_id: uuid.UUID) -> Booking:
    booking = db.scalar(
        select(Booking)
        .options(joinedload(Booking.payments), joinedload(Booking.tourist))
        .where(Booking.id == booking_id)
    )
    if not booking:
        raise NotFoundException("Booking not found.")
    return booking


def _validate_booking_payable(booking: Booking) -> None:
    if booking.booking_status == BookingStatus.cancelled:
        raise ValidationException("This booking has been cancelled.")
    if booking.booking_status == BookingStatus.expired:
        raise ValidationException("This booking has expired.")
    if booking.booking_status == BookingStatus.completed:
        raise ValidationException("This booking is already completed.")
    if booking.booking_status == BookingStatus.confirmed and booking.payment_status == PaymentStatus.paid:
        raise ValidationException("This booking is already paid.")
    if booking.reserved_until and booking.reserved_until < _now():
        raise ValidationException("This booking reservation has expired.")


def initialize_payment(
    db: Session,
    current_user: User,
    booking_id: uuid.UUID,
    payment_gateway: PaymentGateway,
    currency: str = "UGX",
    phone_number: str | None = None,
    redirect_url: str | None = None,
) -> Payment:
    booking = _get_booking_for_payment(db=db, booking_id=booking_id)
    booking = _expire_booking_if_needed(db=db, booking=booking)

    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can initialize payments.")
    if booking.tourist_id != current_user.id:
        raise ForbiddenException("You cannot pay for this booking.")

    _validate_booking_payable(booking)

    # Check for existing paid payment
    existing_paid = db.scalar(
        select(Payment).where(
            Payment.booking_id == booking.id,
            Payment.payment_status == PaymentStatus.paid,
        )
    )
    if existing_paid:
        raise ValidationException("This booking is already paid.")

    tx_ref = f"TXN-{uuid.uuid4().hex[:16].upper()}"
    payment_url = None
    gateway_transaction_id = None

    if payment_gateway == PaymentGateway.mtn_momo:
        if not phone_number:
            raise ValidationException("Phone number is required for MTN MoMo payment.")
        try:
            result = mtn_momo.request_payment(
                amount=str(int(booking.total_price)),
                currency=currency,
                phone_number=phone_number,
                external_id=tx_ref,
                payer_message=f"Payment for booking {booking.booking_reference}",
                payee_note=f"CulturalHub - {booking.package_title_snapshot}",
            )
            gateway_transaction_id = result["reference_id"]
        except ValueError as e:
            raise ValidationException(str(e))

    elif payment_gateway == PaymentGateway.flutterwave:
        tourist = booking.tourist
        final_redirect = redirect_url or f"{settings.FRONTEND_URL}/bookings/payment-callback"

        payment_url = flutterwave.create_payment_link(
            amount=float(booking.total_price),
            currency=currency,
            email=tourist.email,
            name=tourist.full_name,
            phone=phone_number or tourist.phone or "",
            tx_ref=tx_ref,
            redirect_url=final_redirect,
            description=f"Booking: {booking.package_title_snapshot}",
        )

    elif payment_gateway == PaymentGateway.mock:
        pass  # handled separately via mock webhook

    payment = Payment(
        booking_id=booking.id,
        amount=booking.total_price,
        currency=currency,
        payment_gateway=payment_gateway,
        payment_status=PaymentStatus.pending,
        transaction_reference=tx_ref,
        gateway_transaction_id=gateway_transaction_id,
        phone_number=phone_number,
        payment_url=payment_url,
    )
    db.add(payment)

    booking.payment_status = PaymentStatus.pending
    booking.booking_status = BookingStatus.awaiting_payment
    db.add(booking)

    db.commit()
    db.refresh(payment)
    return payment


def check_momo_payment_status(db: Session, transaction_reference: str) -> Payment:
    """Poll MTN MoMo for payment status and update accordingly."""
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking))
        .where(Payment.transaction_reference == transaction_reference)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    if not payment.gateway_transaction_id:
        raise ValidationException("No MoMo reference found for this payment.")

    result = mtn_momo.check_payment_status(payment.gateway_transaction_id)
    status = result.get("status", "PENDING").upper()

    if status == "SUCCESSFUL":
        return mark_payment_success(
            db=db,
            transaction_reference=transaction_reference,
            gateway_response=str(result),
        )
    elif status == "FAILED":
        return mark_payment_failed(
            db=db,
            transaction_reference=transaction_reference,
            gateway_response=str(result),
        )

    # Still pending
    return payment


def verify_flutterwave_callback(
    db: Session,
    transaction_id: str,
    tx_ref: str,
    status: str,
) -> Payment:
    """Handle Flutterwave redirect callback."""
    if status != "successful":
        return mark_payment_failed(
            db=db,
            transaction_reference=tx_ref,
            gateway_response=f"Flutterwave status: {status}",
        )

    # Verify with Flutterwave API
    result = flutterwave.verify_transaction(transaction_id)
    flw_status = result.get("data", {}).get("status", "")

    if flw_status == "successful":
        return mark_payment_success(
            db=db,
            transaction_reference=tx_ref,
            gateway_response=str(result),
        )
    else:
        return mark_payment_failed(
            db=db,
            transaction_reference=tx_ref,
            gateway_response=str(result),
        )


def mark_payment_success(
    db: Session,
    transaction_reference: str,
    gateway_response: str | None = None,
) -> Payment:
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking))
        .where(Payment.transaction_reference == transaction_reference)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    booking = payment.booking
    booking = _expire_booking_if_needed(db=db, booking=booking)

    if booking.booking_status in [BookingStatus.cancelled, BookingStatus.expired]:
        raise ValidationException("Cannot confirm payment for this booking.")

    payment.payment_status = PaymentStatus.paid
    payment.gateway_response = gateway_response
    payment.paid_at = _now()
    booking.payment_status = PaymentStatus.paid
    booking.booking_status = BookingStatus.confirmed

    create_notification(
        db=db,
        user_id=booking.tourist_id,
        notification_type=NotificationType.payment_completed,
        title="Payment Successful",
        message=f"Your payment has been confirmed and your booking is now confirmed.",
        related_entity_id=str(booking.id),
    )

    db.add(payment)
    db.add(booking)
    db.commit()
    db.refresh(payment)
    return payment


def mark_payment_failed(
    db: Session,
    transaction_reference: str,
    gateway_response: str | None = None,
) -> Payment:
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking))
        .where(Payment.transaction_reference == transaction_reference)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    booking = payment.booking
    payment.payment_status = PaymentStatus.failed
    payment.gateway_response = gateway_response

    if booking.booking_status == BookingStatus.awaiting_payment:
        booking.payment_status = PaymentStatus.failed

    create_notification(
        db=db,
        user_id=booking.tourist_id,
        notification_type=NotificationType.payment_failed,
        title="Payment Failed",
        message="Your payment could not be processed. Please try again.",
        related_entity_id=str(booking.id),
    )

    db.add(payment)
    db.add(booking)
    db.commit()
    db.refresh(payment)
    return payment


def process_mock_payment_webhook(
    db: Session,
    transaction_reference: str,
    payment_status: str,
    gateway_response: str | None = None,
) -> Payment:
    normalized = payment_status.strip().lower()
    if normalized == "completed":
        return mark_payment_success(db=db, transaction_reference=transaction_reference,
                                    gateway_response=gateway_response or "Mock approved")
    if normalized == "failed":
        return mark_payment_failed(db=db, transaction_reference=transaction_reference,
                                   gateway_response=gateway_response or "Mock failed")
    raise ValidationException("Unsupported mock payment status.")


def get_payment_by_id(db: Session, payment_id: uuid.UUID, current_user: User) -> Payment:
    from app.models.package import Package
    payment = db.scalar(
        select(Payment).options(joinedload(Payment.booking)).where(Payment.id == payment_id)
    )
    if not payment:
        raise NotFoundException("Payment not found.")
    booking = payment.booking
    if current_user.role == UserRole.tourist and booking.tourist_id != current_user.id:
        raise ForbiddenException("You cannot view this payment.")
    if current_user.role == UserRole.provider:
        provider_site = getattr(current_user, "cultural_site", None)
        pkg = db.scalar(select(Package).where(Package.id == booking.package_id))
        if provider_site is None or pkg is None or pkg.provider_id != provider_site.id:
            raise ForbiddenException("You cannot view this payment.")
    return payment




























































# import uuid
# from datetime import datetime, timezone

# from sqlalchemy import select
# from sqlalchemy.orm import Session, joinedload

# from app.models.booking import Booking, BookingStatus, PaymentStatus
# from app.models.notification import NotificationType
# from app.models.payment import Payment, PaymentGateway
# from app.models.user import User, UserRole
# from app.modules.notifications.service import create_notification
# from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


# def get_payment_by_id(db: Session, payment_id: uuid.UUID, current_user: User) -> Payment:
#     from sqlalchemy.orm import joinedload as jl
#     from app.models.package import Package

#     payment = db.scalar(
#         select(Payment)
#         .options(joinedload(Payment.booking))
#         .where(Payment.id == payment_id)
#     )
#     if not payment:
#         raise NotFoundException("Payment not found.")

#     booking = payment.booking
#     if current_user.role == UserRole.tourist and booking.tourist_id != current_user.id:
#         raise ForbiddenException("You do not have permission to view this payment.")

#     if current_user.role == UserRole.provider:
#         provider_site = getattr(current_user, "cultural_site", None)
#         pkg = db.scalar(select(Package).where(Package.id == booking.package_id))
#         if provider_site is None or pkg is None or pkg.provider_id != provider_site.id:
#             raise ForbiddenException("You do not have permission to view this payment.")

#     return payment


# def _now() -> datetime:
#     return datetime.now(timezone.utc)


# def _expire_booking_if_needed(db: Session, booking: Booking) -> Booking:
#     now = _now()

#     if (
#         booking.booking_status == BookingStatus.awaiting_payment
#         and booking.payment_status in [PaymentStatus.unpaid, PaymentStatus.pending, PaymentStatus.failed]
#         and booking.reserved_until is not None
#         and booking.reserved_until < now
#     ):
#         booking.booking_status = BookingStatus.expired
#         db.add(booking)
#         db.commit()
#         db.refresh(booking)

#     return booking


# def _get_booking_for_payment(db: Session, booking_id: uuid.UUID) -> Booking:
#     booking = db.scalar(
#         select(Booking)
#         .options(joinedload(Booking.payments))
#         .where(Booking.id == booking_id)
#     )
#     if not booking:
#         raise NotFoundException("Booking not found.")
#     return booking


# def _validate_booking_payable(booking: Booking) -> None:
#     if booking.booking_status == BookingStatus.cancelled:
#         raise ValidationException("This booking has already been cancelled.")

#     if booking.booking_status == BookingStatus.expired:
#         raise ValidationException("This booking has expired.")

#     if booking.booking_status == BookingStatus.completed:
#         raise ValidationException("This booking has already been completed.")

#     if booking.booking_status == BookingStatus.confirmed and booking.payment_status == PaymentStatus.paid:
#         raise ValidationException("This booking has already been paid for.")

#     if booking.reserved_until and booking.reserved_until < _now():
#         raise ValidationException("This booking reservation has expired.")


# def initialize_payment(
#     db: Session,
#     current_user: User,
#     booking_id: uuid.UUID,
#     payment_gateway: PaymentGateway,
#     currency: str = "UGX",
# ) -> Payment:
#     booking = _get_booking_for_payment(db=db, booking_id=booking_id)
#     booking = _expire_booking_if_needed(db=db, booking=booking)

#     if current_user.role != UserRole.tourist:
#         raise ForbiddenException("Only tourists can initialize payments.")

#     if booking.tourist_id != current_user.id:
#         raise ForbiddenException("You do not have permission to pay for this booking.")

#     _validate_booking_payable(booking)

#     existing_paid_payment = db.scalar(
#         select(Payment).where(
#             Payment.booking_id == booking.id,
#             Payment.payment_status == PaymentStatus.paid,
#         )
#     )
#     if existing_paid_payment:
#         raise ValidationException("This booking has already been paid for.")

#     existing_pending_payment = db.scalar(
#         select(Payment).where(
#             Payment.booking_id == booking.id,
#             Payment.payment_status == PaymentStatus.pending,
#         )
#     )
#     if existing_pending_payment:
#         booking.payment_status = PaymentStatus.pending
#         db.add(booking)
#         db.commit()
#         db.refresh(existing_pending_payment)
#         return existing_pending_payment

#     transaction_reference = f"TXN-{uuid.uuid4().hex[:16].upper()}"

#     payment = Payment(
#         booking_id=booking.id,
#         amount=booking.total_price,
#         currency=currency,
#         payment_gateway=payment_gateway,
#         payment_status=PaymentStatus.pending,
#         transaction_reference=transaction_reference,
#         gateway_response=None,
#         paid_at=None,
#     )
#     db.add(payment)

#     booking.payment_status = PaymentStatus.pending
#     booking.booking_status = BookingStatus.awaiting_payment
#     db.add(booking)

#     db.commit()
#     db.refresh(payment)
#     return payment


# def mark_payment_success(
#     db: Session,
#     transaction_reference: str,
#     gateway_response: str | None = None,
# ) -> Payment:
#     payment = db.scalar(
#         select(Payment)
#         .options(joinedload(Payment.booking))
#         .where(Payment.transaction_reference == transaction_reference)
#     )
#     if not payment:
#         raise NotFoundException("Payment not found.")

#     booking = payment.booking
#     booking = _expire_booking_if_needed(db=db, booking=booking)

#     if booking.booking_status == BookingStatus.cancelled:
#         raise ValidationException("Cannot confirm payment for a cancelled booking.")

#     if booking.booking_status == BookingStatus.expired:
#         raise ValidationException("Cannot confirm payment for an expired booking.")

#     payment.payment_status = PaymentStatus.paid
#     payment.gateway_response = gateway_response
#     payment.paid_at = _now()

#     booking.payment_status = PaymentStatus.paid
#     booking.booking_status = BookingStatus.confirmed

#     create_notification(
#         db=db,
#         user_id=booking.tourist_id,
#         notification_type=NotificationType.payment_completed,
#         title="Payment Successful",
#         message=f"Your payment has been confirmed and your booking is now confirmed.",
#         related_entity_id=str(booking.id),
#     )

#     db.add(payment)
#     db.add(booking)
#     db.commit()
#     db.refresh(payment)
#     return payment


# def mark_payment_failed(
#     db: Session,
#     transaction_reference: str,
#     gateway_response: str | None = None,
# ) -> Payment:
#     payment = db.scalar(
#         select(Payment)
#         .options(joinedload(Payment.booking))
#         .where(Payment.transaction_reference == transaction_reference)
#     )
#     if not payment:
#         raise NotFoundException("Payment not found.")

#     booking = payment.booking
#     booking = _expire_booking_if_needed(db=db, booking=booking)

#     payment.payment_status = PaymentStatus.failed
#     payment.gateway_response = gateway_response

#     if booking.booking_status == BookingStatus.awaiting_payment:
#         booking.payment_status = PaymentStatus.failed

#     create_notification(
#         db=db,
#         user_id=booking.tourist_id,
#         notification_type=NotificationType.payment_failed,
#         title="Payment Failed",
#         message="Your payment could not be processed. Please try again.",
#         related_entity_id=str(booking.id),
#     )

#     db.add(payment)
#     db.add(booking)
#     db.commit()
#     db.refresh(payment)
#     return payment


# def process_mock_payment_webhook(
#     db: Session,
#     transaction_reference: str,
#     payment_status: str,
#     gateway_response: str | None = None,
# ) -> Payment:
#     normalized_status = payment_status.strip().lower()

#     if normalized_status == "completed":
#         return mark_payment_success(
#             db=db,
#             transaction_reference=transaction_reference,
#             gateway_response=gateway_response or "Mock gateway payment approved",
#         )

#     if normalized_status == "failed":
#         return mark_payment_failed(
#             db=db,
#             transaction_reference=transaction_reference,
#             gateway_response=gateway_response or "Mock gateway payment failed",
#         )

#     raise ValidationException("Unsupported mock payment status.")

