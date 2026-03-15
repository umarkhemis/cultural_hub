
import uuid

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class BookingParticipant(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "booking_participants"

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
    )
    participant_name: Mapped[str] = mapped_column(String(150), nullable=False)
    participant_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    participant_phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    special_requests: Mapped[str | None] = mapped_column(Text, nullable=True)

    booking = relationship("Booking", back_populates="participants")

    __table_args__ = (
        Index("ix_booking_participants_booking_id", "booking_id"),
    )