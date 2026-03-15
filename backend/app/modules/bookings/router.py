
import uuid

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.bookings.schema import BookingCreateRequest, BookingStatusUpdateRequest
from app.modules.bookings.service import (
    create_booking,
    get_booking_detail_for_owner,
    list_provider_bookings,
    list_tourist_bookings,
    update_booking_status,
)
from app.modules.packages.serializers import serialize_booking
from app.utils.responses import success_response

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_booking_endpoint(
    payload: BookingCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    booking = create_booking(db=db, current_user=current_user, payload=payload)
    booking = get_booking_detail_for_owner(db=db, current_user=current_user, booking_id=booking.id)
    return success_response(
        message="Booking created successfully.",
        data=serialize_booking(booking),
    )


@router.get("/me")
def my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    bookings = list_tourist_bookings(db=db, current_user=current_user)
    return success_response(
        message="Tourist bookings retrieved successfully.",
        data={"items": [serialize_booking(booking) for booking in bookings]},
    )


@router.get("/provider")
def provider_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    bookings = list_provider_bookings(db=db, current_user=current_user)
    return success_response(
        message="Provider bookings retrieved successfully.",
        data={"items": [serialize_booking(booking) for booking in bookings]},
    )


@router.get("/{booking_id}")
def booking_detail(
    booking_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist, UserRole.provider, UserRole.admin)),
):
    booking = get_booking_detail_for_owner(db=db, current_user=current_user, booking_id=booking_id)
    return success_response(
        message="Booking retrieved successfully.",
        data=serialize_booking(booking),
    )


@router.patch("/{booking_id}/status")
def update_booking_status_endpoint(
    booking_id: uuid.UUID,
    payload: BookingStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    booking = update_booking_status(
        db=db,
        current_user=current_user,
        booking_id=booking_id,
        payload=payload,
    )
    booking = get_booking_detail_for_owner(db=db, current_user=current_user, booking_id=booking.id)
    return success_response(
        message="Booking status updated successfully.",
        data=serialize_booking(booking),
    )