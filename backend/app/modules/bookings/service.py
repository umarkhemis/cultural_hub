
import uuid
from datetime import datetime, timezone

from sqlalchemy import desc, select
from sqlalchemy.orm import Session, joinedload

from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.booking_participant import BookingParticipant
from app.models.cultural_site import CulturalSite
from app.models.package import Package, PackageStatus
from app.models.user import User, UserRole
from app.modules.bookings.schema import BookingCreateRequest, BookingStatusUpdateRequest
from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


def create_booking(db: Session, current_user: User, payload: BookingCreateRequest) -> Booking:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can create bookings.")

    try:
        package_uuid = uuid.UUID(payload.package_id)
    except ValueError as exc:
        raise ValidationException("Invalid package_id.") from exc

    package = db.scalar(
        select(Package)
        .options(joinedload(Package.provider))
        .where(
            Package.id == package_uuid,
            Package.status == PackageStatus.published,
        )
    )
    if not package:
        raise NotFoundException("Package not found.")

    participants_count = len(payload.participants)
    total_price = package.price * participants_count

    booking = Booking(
        tourist_id=current_user.id,
        package_id=package.id,
        booking_status=BookingStatus.pending,
        payment_status=PaymentStatus.unpaid,
        participants_count=participants_count,
        total_price=total_price,
        booking_date=datetime.now(timezone.utc),
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
    db.refresh(booking)
    return booking


def get_booking_detail_for_owner(db: Session, current_user: User, booking_id: uuid.UUID) -> Booking:
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

    if current_user.role == UserRole.tourist:
        if booking.tourist_id != current_user.id:
            raise ForbiddenException("You can only view your own bookings.")
        return booking

    if current_user.role == UserRole.provider:
        site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == current_user.id))
        if not site or booking.package.provider_id != site.id:
            raise ForbiddenException("You can only view bookings for your own packages.")
        return booking

    if current_user.role == UserRole.admin:
        return booking

    raise ForbiddenException("Access denied.")


def list_tourist_bookings(db: Session, current_user: User) -> list[Booking]:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can view their bookings.")

    bookings = db.scalars(
        select(Booking)
        .options(
            joinedload(Booking.participants),
            joinedload(Booking.package).joinedload(Package.provider),
        )
        .where(Booking.tourist_id == current_user.id)
        .order_by(desc(Booking.booking_date))
    ).unique().all()

    return list(bookings)


def list_provider_bookings(db: Session, current_user: User) -> list[Booking]:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can view provider bookings.")

    site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == current_user.id))
    if not site:
        raise ForbiddenException("Provider profile not found.")

    bookings = db.scalars(
        select(Booking)
        .options(
            joinedload(Booking.participants),
            joinedload(Booking.package).joinedload(Package.provider),
        )
        .join(Package, Booking.package_id == Package.id)
        .where(Package.provider_id == site.id)
        .order_by(desc(Booking.booking_date))
    ).unique().all()

    return list(bookings)


def update_booking_status(
    db: Session,
    current_user: User,
    booking_id: uuid.UUID,
    payload: BookingStatusUpdateRequest,
) -> Booking:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can update booking status.")

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

    site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == current_user.id))
    if not site or booking.package.provider_id != site.id:
        raise ForbiddenException("You can only manage bookings for your own packages.")

    try:
        new_status = BookingStatus(payload.booking_status)
    except ValueError as exc:
        raise ValidationException("Invalid booking status.") from exc

    allowed_statuses = {
        BookingStatus.pending,
        BookingStatus.confirmed,
        BookingStatus.cancelled,
        BookingStatus.completed,
    }
    if new_status not in allowed_statuses:
        raise ValidationException("Unsupported booking status.")

    booking.booking_status = new_status
    db.commit()
    db.refresh(booking)
    return booking