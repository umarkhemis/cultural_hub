
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field


class BookingParticipantRequest(BaseModel):
    participant_name: str = Field(min_length=2, max_length=150)
    participant_email: EmailStr | None = None
    participant_phone: str | None = Field(default=None, max_length=30)
    special_requests: str | None = Field(default=None, max_length=500)


class BookingCreateRequest(BaseModel):
    package_id: str
    participants: list[BookingParticipantRequest] = Field(min_length=1)
    booking_notes: str | None = Field(default=None, max_length=1000)


class BookingParticipantResponse(BaseModel):
    id: str
    participant_name: str
    participant_email: str | None
    participant_phone: str | None
    special_requests: str | None

    class Config:
        from_attributes = True


class BookingResponse(BaseModel):
    id: str
    booking_reference: str
    tourist_id: str
    package_id: str
    booking_status: str
    payment_status: str
    participants_count: int
    total_price: Decimal
    booking_date: datetime
    reserved_until: datetime | None
    cancelled_at: datetime | None
    cancellation_reason: str | None
    booking_notes: str | None
    package_title_snapshot: str
    provider_name_snapshot: str
    event_date_snapshot: datetime | None
    participants: list[BookingParticipantResponse]

    class Config:
        from_attributes = True


class BookingCancelRequest(BaseModel):
    reason: str | None = Field(default=None, max_length=500)





