
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, EmailStr, Field, field_validator


class BookingParticipantCreate(BaseModel):
    participant_name: str = Field(min_length=2, max_length=150)
    participant_email: EmailStr | None = None
    participant_phone: str | None = Field(default=None, max_length=30)
    special_requests: str | None = None

    @field_validator("participant_name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        return value.strip()


class BookingCreateRequest(BaseModel):
    package_id: str
    participants: list[BookingParticipantCreate] = Field(min_length=1, max_length=20)


class BookingStatusUpdateRequest(BaseModel):
    booking_status: str