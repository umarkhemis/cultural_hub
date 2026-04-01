
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
    list_provider_bookings,
    list_tourist_bookings,
)
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

