
import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.booking_participant import BookingParticipant
from app.models.package import Package, PackageStatus
from app.models.user import User, UserRole
from app.utils.booking_reference import generate_booking_reference
from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _quantize_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _expire_booking_if_needed(db: Session, booking: Booking) -> None:
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


def get_booking_by_id(db: Session, booking_id: uuid.UUID) -> Booking:
    booking = db.scalar(
        select(Booking)
        .options(
            joinedload(Booking.participants),
            joinedload(Booking.package).joinedload(Package.provider),
        )
        .where(Booking.id == booking_id)
    )
    if not booking:
        raise NotFoundException("Booking not found.")
    return booking


def create_booking(db: Session, current_user: User, payload) -> Booking:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can create bookings.")

    package = db.scalar(
        select(Package)
        .options(joinedload(Package.provider))
        .where(
            Package.id == payload.package_id,
            Package.status == PackageStatus.published,
        )
    )
    if not package:
        raise ValidationException("Package is not available.")

    existing = db.scalar(
        select(Booking).where(
            Booking.tourist_id == current_user.id,
            Booking.package_id == package.id,
            Booking.booking_status.in_([
                BookingStatus.awaiting_payment,
                BookingStatus.confirmed,
            ]),
        )
    )
    if existing:
        _expire_booking_if_needed(db, existing)
        db.refresh(existing)
        if existing.booking_status in [BookingStatus.awaiting_payment, BookingStatus.confirmed]:
            raise ValidationException("You already have an active booking for this package.")

    participants_count = len(payload.participants)
    if participants_count <= 0:
        raise ValidationException("At least one participant is required.")

    base_price = _quantize_money(Decimal(str(package.price)) * Decimal(participants_count))
    platform_fee = _quantize_money(base_price * Decimal(str(settings.PLATFORM_BOOKING_FEE_PERCENT)))
    total_price = base_price
    provider_payout_amount = _quantize_money(base_price - platform_fee)


    now = _now()

    booking = Booking(
        tourist_id=current_user.id,
        package_id=package.id,
        booking_reference=generate_booking_reference(),
        booking_status=BookingStatus.awaiting_payment,
        payment_status=PaymentStatus.unpaid,
        participants_count=participants_count,
        base_price=base_price,
        platform_fee=platform_fee,
        total_price=total_price,
        provider_payout_amount=provider_payout_amount,
        currency=settings.DEFAULT_CURRENCY,
        booking_date=now,
        reserved_until=now + timedelta(minutes=settings.BOOKING_RESERVATION_MINUTES),
        cancelled_at=None,
        cancellation_reason=None,
        booking_notes=payload.booking_notes,
        package_title_snapshot=package.package_name,
        provider_name_snapshot=package.provider.site_name,
        event_date_snapshot=package.event_date,
    )
    db.add(booking)
    db.flush()

    for participant in payload.participants:
        db.add(
            BookingParticipant(
                booking_id=booking.id,
                participant_name=participant.participant_name,
                participant_email=participant.participant_email,
                participant_phone=participant.participant_phone,
                special_requests=participant.special_requests,
            )
        )

    db.commit()
    return get_booking_by_id(db=db, booking_id=booking.id)


def list_tourist_bookings(db: Session, current_user: User) -> list[Booking]:
    bookings = db.scalars(
        select(Booking)
        .options(joinedload(Booking.participants))
        .where(Booking.tourist_id == current_user.id)
        .order_by(Booking.created_at.desc())
    ).unique().all()

    for booking in bookings:
        _expire_booking_if_needed(db, booking)

    return list(
        db.scalars(
            select(Booking)
            .options(joinedload(Booking.participants))
            .where(Booking.tourist_id == current_user.id)
            .order_by(Booking.created_at.desc())
        ).unique().all()
    )


def list_provider_bookings(db: Session, current_user: User) -> list[Booking]:
    if not current_user.cultural_site:
        raise ValidationException("Provider cultural site profile is not set up.")

    bookings = db.scalars(
        select(Booking)
        .join(Package, Booking.package_id == Package.id)
        .options(joinedload(Booking.participants))
        .where(Package.provider_id == current_user.cultural_site.id)
        .order_by(Booking.created_at.desc())
    ).unique().all()

    for booking in bookings:
        _expire_booking_if_needed(db, booking)

    return list(
        db.scalars(
            select(Booking)
            .join(Package, Booking.package_id == Package.id)
            .options(joinedload(Booking.participants))
            .where(Package.provider_id == current_user.cultural_site.id)
            .order_by(Booking.created_at.desc())
        ).unique().all()
    )


def cancel_booking(db: Session, current_user: User, booking_id: uuid.UUID, reason: str | None = None) -> Booking:
    booking = get_booking_by_id(db=db, booking_id=booking_id)

    if current_user.role == UserRole.tourist and booking.tourist_id != current_user.id:
        raise ForbiddenException("You cannot cancel this booking.")

    if booking.booking_status in [BookingStatus.cancelled, BookingStatus.expired, BookingStatus.completed]:
        raise ValidationException("This booking cannot be cancelled.")

    booking.booking_status = BookingStatus.cancelled
    booking.cancelled_at = _now()
    booking.cancellation_reason = reason
    db.commit()
    db.refresh(booking)
    return booking






























# import uuid
# from datetime import datetime, timedelta, timezone
# from sqlalchemy import select
# from sqlalchemy.orm import Session, joinedload

# from app.models.booking import Booking, BookingStatus, PaymentStatus
# from app.models.booking_participant import BookingParticipant
# from app.models.package import Package, PackageStatus
# from app.models.user import User, UserRole
# from app.utils.booking_reference import generate_booking_reference
# from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


# RESERVATION_MINUTES = 120


# def _expire_booking_if_needed(db: Session, booking: Booking) -> None:
#     now = datetime.now(timezone.utc)

#     if (
#         booking.booking_status == BookingStatus.awaiting_payment
#         and booking.payment_status in [PaymentStatus.unpaid, PaymentStatus.failed, PaymentStatus.pending]
#         and booking.reserved_until
#         and booking.reserved_until < now
#     ):
#         booking.booking_status = BookingStatus.expired
#         db.add(booking)
#         db.commit()
#         db.refresh(booking)


# def create_booking(db: Session, current_user: User, payload) -> Booking:
#     if current_user.role != UserRole.tourist:
#         raise ForbiddenException("Only tourists can create bookings.")

#     package = db.scalar(
#         select(Package)
#         .options(joinedload(Package.provider))
#         .where(
#             Package.id == payload.package_id,
#             Package.status == PackageStatus.published,
#         )
#     )
#     if not package:
#         raise ValidationException("Package is not available.")

#     active_booking = db.scalar(
#         select(Booking).where(
#             Booking.tourist_id == current_user.id,
#             Booking.package_id == package.id,
#             Booking.booking_status.in_([
#                 BookingStatus.awaiting_payment,
#                 BookingStatus.confirmed,
#             ]),
#         )
#     )
#     if active_booking:
#         _expire_booking_if_needed(db, active_booking)
#         db.refresh(active_booking)
#         if active_booking.booking_status in [BookingStatus.awaiting_payment, BookingStatus.confirmed]:
#             raise ValidationException("You already have an active booking for this package.")

#     now = datetime.now(timezone.utc)
#     participants_count = len(payload.participants)

#     booking = Booking(
#         tourist_id=current_user.id,
#         package_id=package.id,
#         booking_reference=generate_booking_reference(),
#         booking_status=BookingStatus.awaiting_payment,
#         payment_status=PaymentStatus.unpaid,
#         participants_count=participants_count,
#         total_price=package.price * participants_count,
#         booking_date=now,
#         reserved_until=now + timedelta(minutes=RESERVATION_MINUTES),
#         booking_notes=payload.booking_notes,
#         package_title_snapshot=package.package_name,
#         provider_name_snapshot=package.provider.site_name,
#         event_date_snapshot=package.event_date,
#     )
#     db.add(booking)
#     db.flush()

#     for participant in payload.participants:
#         db.add(
#             BookingParticipant(
#                 booking_id=booking.id,
#                 participant_name=participant.participant_name,
#                 participant_email=participant.participant_email,
#                 participant_phone=participant.participant_phone,
#                 special_requests=participant.special_requests,
#             )
#         )

#     db.commit()
#     db.refresh(booking)
#     return get_booking_by_id(db=db, booking_id=booking.id)


# def get_booking_by_id(db: Session, booking_id: uuid.UUID) -> Booking:
#     booking = db.scalar(
#         select(Booking)
#         .options(joinedload(Booking.participants))
#         .where(Booking.id == booking_id)
#     )
#     if not booking:
#         raise NotFoundException("Booking not found.")
#     return booking


# def list_tourist_bookings(db: Session, current_user: User) -> list[Booking]:
#     bookings = db.scalars(
#         select(Booking)
#         .options(joinedload(Booking.participants))
#         .where(Booking.tourist_id == current_user.id)
#         .order_by(Booking.created_at.desc())
#     ).unique().all()

#     for booking in bookings:
#         _expire_booking_if_needed(db, booking)

#     return list(
#         db.scalars(
#             select(Booking)
#             .options(joinedload(Booking.participants))
#             .where(Booking.tourist_id == current_user.id)
#             .order_by(Booking.created_at.desc())
#         ).unique().all()
#     )


# def list_provider_bookings(db: Session, current_user: User) -> list[Booking]:
#     bookings = db.scalars(
#         select(Booking)
#         .join(Package, Booking.package_id == Package.id)
#         .options(joinedload(Booking.participants))
#         .where(Package.provider_id == current_user.cultural_site.id)
#         .order_by(Booking.created_at.desc())
#     ).unique().all()

#     for booking in bookings:
#         _expire_booking_if_needed(db, booking)

#     return list(
#         db.scalars(
#             select(Booking)
#             .join(Package, Booking.package_id == Package.id)
#             .options(joinedload(Booking.participants))
#             .where(Package.provider_id == current_user.cultural_site.id)
#             .order_by(Booking.created_at.desc())
#         ).unique().all()
#     )


# def cancel_booking(db: Session, current_user: User, booking_id: uuid.UUID, reason: str | None = None) -> Booking:
#     booking = get_booking_by_id(db=db, booking_id=booking_id)

#     if current_user.role == UserRole.tourist and booking.tourist_id != current_user.id:
#         raise ForbiddenException("You cannot cancel this booking.")

#     if booking.booking_status in [BookingStatus.cancelled, BookingStatus.expired, BookingStatus.completed]:
#         raise ValidationException("This booking cannot be cancelled.")

#     booking.booking_status = BookingStatus.cancelled
#     booking.cancelled_at = datetime.now(timezone.utc)
#     booking.cancellation_reason = reason
#     db.commit()
#     db.refresh(booking)
#     return booking


