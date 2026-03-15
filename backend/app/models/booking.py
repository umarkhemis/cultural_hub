
import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


class PaymentStatus(str, enum.Enum):
    unpaid = "unpaid"
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"


class Booking(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "bookings"

    tourist_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    package_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("packages.id", ondelete="RESTRICT"),
        nullable=False,
    )

    booking_status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        nullable=False,
        default=BookingStatus.pending,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        nullable=False,
        default=PaymentStatus.unpaid,
    )

    participants_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    total_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    booking_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    package_title_snapshot: Mapped[str] = mapped_column(String(200), nullable=False)
    provider_name_snapshot: Mapped[str] = mapped_column(String(200), nullable=False)
    event_date_snapshot: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    package = relationship("Package")
    participants = relationship(
        "BookingParticipant",
        back_populates="booking",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_bookings_tourist_id", "tourist_id"),
        Index("ix_bookings_package_id", "package_id"),
        Index("ix_bookings_booking_date", "booking_date"),
        Index("ix_bookings_booking_status", "booking_status"),
        Index("ix_bookings_payment_status", "payment_status"),
        Index("ix_bookings_tourist_booking_date", "tourist_id", "booking_date"),
        Index("ix_bookings_package_booking_date", "package_id", "booking_date"),
    )