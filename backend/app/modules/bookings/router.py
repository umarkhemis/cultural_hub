
import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.bookings.schema import BookingCancelRequest, BookingCreateRequest
from app.modules.bookings.service import (
    cancel_booking,
    create_booking,
    get_booking_by_id,
    list_provider_bookings,
    list_tourist_bookings,
)
from app.modules.users.service import get_current_user
from app.utils.exceptions import ForbiddenException
from app.utils.responses import success_response

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking_endpoint(
    payload: BookingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    booking = create_booking(db=db, current_user=current_user, payload=payload)
    return success_response(
        message="Booking created successfully.",
        data=booking,
    )


@router.get("/me")
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    items = list_tourist_bookings(db=db, current_user=current_user)
    return success_response(
        message="Bookings retrieved successfully.",
        data={"items": items},
    )


@router.get("/provider")
def provider_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    items = list_provider_bookings(db=db, current_user=current_user)
    return success_response(
        message="Provider bookings retrieved successfully.",
        data={"items": items},
    )


@router.get("/{booking_id}")
def get_booking_detail(
    booking_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = get_booking_by_id(db=db, booking_id=booking_id)
    if current_user.role == UserRole.tourist and booking.tourist_id != current_user.id:
        raise ForbiddenException("You cannot view this booking.")
    if current_user.role == UserRole.provider:
        provider_site = getattr(current_user, "cultural_site", None)
        if provider_site is None or booking.package.provider_id != provider_site.id:
            raise ForbiddenException("You cannot view this booking.")
    return success_response(
        message="Booking retrieved successfully.",
        data=booking,
    )


@router.post("/{booking_id}/cancel")
def cancel_booking_endpoint(
    booking_id: uuid.UUID,
    payload: BookingCancelRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist, UserRole.admin)),
):
    booking = cancel_booking(
        db=db,
        current_user=current_user,
        booking_id=booking_id,
        reason=payload.reason,
    )
    return success_response(
        message="Booking cancelled successfully.",
        data=booking,
    )

