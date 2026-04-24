
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
from app.services import mtn_momo, pesapal
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
        .options(
            joinedload(Booking.payments),
            joinedload(Booking.tourist),
        )
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
    pesapal_order_tracking_id = None

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

    elif payment_gateway == PaymentGateway.pesapal:
        try:
            tourist = booking.tourist
            name_parts = tourist.full_name.strip().split(" ", 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else first_name

            # Register IPN if not set
            ipn_id = settings.PESAPAL_IPN_ID  # store this after first registration

            final_callback = redirect_url or f"{settings.FRONTEND_URL}/bookings/payment-callback"

            result = pesapal.submit_order(
                order_id=tx_ref,
                amount=float(booking.total_price),
                currency=currency,
                description=f"Booking: {booking.package_title_snapshot}",
                email=tourist.email,
                phone=phone_number or getattr(tourist, "phone", "") or "",
                first_name=first_name,
                last_name=last_name,
                ipn_id=ipn_id,
                callback_url=final_callback,
            )
            payment_url = result["redirect_url"]
            pesapal_order_tracking_id = result["order_tracking_id"]
        except ValueError as e:
            raise ValidationException(str(e))

    elif payment_gateway == PaymentGateway.mock:
        pass  # handled via mock webhook

    payment = Payment(
        booking_id=booking.id,
        amount=booking.total_price,
        currency=currency,
        payment_gateway=payment_gateway,
        payment_status=PaymentStatus.pending,
        transaction_reference=tx_ref,
        gateway_transaction_id=gateway_transaction_id,
        pesapal_order_tracking_id=pesapal_order_tracking_id,
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


def verify_pesapal_payment(
    db: Session,
    order_tracking_id: str,
    order_merchant_reference: str,
) -> Payment:
    """Called from webhook or callback to verify and update payment."""
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking))
        .where(Payment.transaction_reference == order_merchant_reference)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    try:
        result = pesapal.get_transaction_status(order_tracking_id)
    except ValueError as e:
        raise ValidationException(str(e))

    status = result.get("payment_status_description", "").lower()

    if status == "completed":
        return mark_payment_success(
            db=db,
            transaction_reference=order_merchant_reference,
            gateway_response=str(result),
        )
    elif status in ["failed", "invalid"]:
        return mark_payment_failed(
            db=db,
            transaction_reference=order_merchant_reference,
            gateway_response=str(result),
        )

    # Still pending
    return payment


def check_momo_payment_status(db: Session, transaction_reference: str) -> Payment:
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking))
        .where(Payment.transaction_reference == transaction_reference)
    )
    if not payment:
        raise NotFoundException("Payment not found.")

    if not payment.gateway_transaction_id:
        raise ValidationException("No MoMo reference found for this payment.")

    try:
        result = mtn_momo.check_payment_status(payment.gateway_transaction_id)
    except ValueError as e:
        raise ValidationException(str(e))

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

    return payment


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
        message="Your payment has been confirmed and your booking is now confirmed.",
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
        return mark_payment_success(
            db=db,
            transaction_reference=transaction_reference,
            gateway_response=gateway_response or "Mock approved",
        )
    if normalized == "failed":
        return mark_payment_failed(
            db=db,
            transaction_reference=transaction_reference,
            gateway_response=gateway_response or "Mock failed",
        )
    raise ValidationException("Unsupported mock payment status.")


def get_payment_by_id(db: Session, payment_id: uuid.UUID, current_user: User) -> Payment:
    from app.models.package import Package
    payment = db.scalar(
        select(Payment)
        .options(joinedload(Payment.booking))
        .where(Payment.id == payment_id)
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

# from app.core.config import settings
# from app.models.booking import Booking, BookingStatus, PaymentStatus
# from app.models.notification import NotificationType
# from app.models.payment import Payment, PaymentGateway
# from app.models.user import User, UserRole
# from app.modules.notifications.service import create_notification
# from app.services import mtn_momo, flutterwave
# from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


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
#         .options(joinedload(Booking.payments), joinedload(Booking.tourist))
#         .where(Booking.id == booking_id)
#     )
#     if not booking:
#         raise NotFoundException("Booking not found.")
#     return booking


# def _validate_booking_payable(booking: Booking) -> None:
#     if booking.booking_status == BookingStatus.cancelled:
#         raise ValidationException("This booking has been cancelled.")
#     if booking.booking_status == BookingStatus.expired:
#         raise ValidationException("This booking has expired.")
#     if booking.booking_status == BookingStatus.completed:
#         raise ValidationException("This booking is already completed.")
#     if booking.booking_status == BookingStatus.confirmed and booking.payment_status == PaymentStatus.paid:
#         raise ValidationException("This booking is already paid.")
#     if booking.reserved_until and booking.reserved_until < _now():
#         raise ValidationException("This booking reservation has expired.")


# def initialize_payment(
#     db: Session,
#     current_user: User,
#     booking_id: uuid.UUID,
#     payment_gateway: PaymentGateway,
#     currency: str = "UGX",
#     phone_number: str | None = None,
#     redirect_url: str | None = None,
# ) -> Payment:
#     booking = _get_booking_for_payment(db=db, booking_id=booking_id)
#     booking = _expire_booking_if_needed(db=db, booking=booking)

#     if current_user.role != UserRole.tourist:
#         raise ForbiddenException("Only tourists can initialize payments.")
#     if booking.tourist_id != current_user.id:
#         raise ForbiddenException("You cannot pay for this booking.")

#     _validate_booking_payable(booking)

#     # Check for existing paid payment
#     existing_paid = db.scalar(
#         select(Payment).where(
#             Payment.booking_id == booking.id,
#             Payment.payment_status == PaymentStatus.paid,
#         )
#     )
#     if existing_paid:
#         raise ValidationException("This booking is already paid.")

#     tx_ref = f"TXN-{uuid.uuid4().hex[:16].upper()}"
#     payment_url = None
#     gateway_transaction_id = None

#     if payment_gateway == PaymentGateway.mtn_momo:
#         if not phone_number:
#             raise ValidationException("Phone number is required for MTN MoMo payment.")
#         try:
#             result = mtn_momo.request_payment(
#                 amount=str(int(booking.total_price)),
#                 currency=currency,
#                 phone_number=phone_number,
#                 external_id=tx_ref,
#                 payer_message=f"Payment for booking {booking.booking_reference}",
#                 payee_note=f"CulturalHub - {booking.package_title_snapshot}",
#             )
#             gateway_transaction_id = result["reference_id"]
#         except ValueError as e:
#             raise ValidationException(str(e))

#     elif payment_gateway == PaymentGateway.flutterwave:
#         tourist = booking.tourist
#         final_redirect = redirect_url or f"{settings.FRONTEND_URL}/bookings/payment-callback"

#         payment_url = flutterwave.create_payment_link(
#             amount=float(booking.total_price),
#             currency=currency,
#             email=tourist.email,
#             name=tourist.full_name,
#             phone=phone_number or tourist.phone or "",
#             tx_ref=tx_ref,
#             redirect_url=final_redirect,
#             description=f"Booking: {booking.package_title_snapshot}",
#         )

#     elif payment_gateway == PaymentGateway.mock:
#         pass  # handled separately via mock webhook

#     payment = Payment(
#         booking_id=booking.id,
#         amount=booking.total_price,
#         currency=currency,
#         payment_gateway=payment_gateway,
#         payment_status=PaymentStatus.pending,
#         transaction_reference=tx_ref,
#         gateway_transaction_id=gateway_transaction_id,
#         phone_number=phone_number,
#         payment_url=payment_url,
#     )
#     db.add(payment)

#     booking.payment_status = PaymentStatus.pending
#     booking.booking_status = BookingStatus.awaiting_payment
#     db.add(booking)

#     db.commit()
#     db.refresh(payment)
#     return payment


# def check_momo_payment_status(db: Session, transaction_reference: str) -> Payment:
#     payment = db.scalar(
#         select(Payment)
#         .options(joinedload(Payment.booking))
#         .where(Payment.transaction_reference == transaction_reference)
#     )
#     if not payment:
#         raise NotFoundException("Payment not found.")

#     if not payment.gateway_transaction_id:
#         raise ValidationException("No MoMo reference found for this payment.")

#     try:
#         result = mtn_momo.check_payment_status(payment.gateway_transaction_id)
#     except ValueError as e:
#         raise ValidationException(str(e))

#     status = result.get("status", "PENDING").upper()

#     if status == "SUCCESSFUL":
#         return mark_payment_success(
#             db=db,
#             transaction_reference=transaction_reference,
#             gateway_response=str(result),
#         )
#     elif status == "FAILED":
#         return mark_payment_failed(
#             db=db,
#             transaction_reference=transaction_reference,
#             gateway_response=str(result),
#         )

#     # Still pending - just return current payment as-is
#     return payment


# def verify_flutterwave_callback(
#     db: Session,
#     transaction_id: str,
#     tx_ref: str,
#     status: str,
# ) -> Payment:
#     """Handle Flutterwave redirect callback."""
#     if status != "successful":
#         return mark_payment_failed(
#             db=db,
#             transaction_reference=tx_ref,
#             gateway_response=f"Flutterwave status: {status}",
#         )

#     # Verify with Flutterwave API
#     result = flutterwave.verify_transaction(transaction_id)
#     flw_status = result.get("data", {}).get("status", "")

#     if flw_status == "successful":
#         return mark_payment_success(
#             db=db,
#             transaction_reference=tx_ref,
#             gateway_response=str(result),
#         )
#     else:
#         return mark_payment_failed(
#             db=db,
#             transaction_reference=tx_ref,
#             gateway_response=str(result),
#         )


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

#     if booking.booking_status in [BookingStatus.cancelled, BookingStatus.expired]:
#         raise ValidationException("Cannot confirm payment for this booking.")

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
#     normalized = payment_status.strip().lower()
#     if normalized == "completed":
#         return mark_payment_success(db=db, transaction_reference=transaction_reference,
#                                     gateway_response=gateway_response or "Mock approved")
#     if normalized == "failed":
#         return mark_payment_failed(db=db, transaction_reference=transaction_reference,
#                                    gateway_response=gateway_response or "Mock failed")
#     raise ValidationException("Unsupported mock payment status.")


# def get_payment_by_id(db: Session, payment_id: uuid.UUID, current_user: User) -> Payment:
#     from app.models.package import Package
#     payment = db.scalar(
#         select(Payment).options(joinedload(Payment.booking)).where(Payment.id == payment_id)
#     )
#     if not payment:
#         raise NotFoundException("Payment not found.")
#     booking = payment.booking
#     if current_user.role == UserRole.tourist and booking.tourist_id != current_user.id:
#         raise ForbiddenException("You cannot view this payment.")
#     if current_user.role == UserRole.provider:
#         provider_site = getattr(current_user, "cultural_site", None)
#         pkg = db.scalar(select(Package).where(Package.id == booking.package_id))
#         if provider_site is None or pkg is None or pkg.provider_id != provider_site.id:
#             raise ForbiddenException("You cannot view this payment.")
#     return payment



