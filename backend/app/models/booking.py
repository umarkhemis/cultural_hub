
import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class BookingStatus(str, enum.Enum):
    awaiting_payment = "awaiting_payment"
    confirmed = "confirmed"
    cancelled = "cancelled"
    expired = "expired"
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
        ForeignKey("packages.id", ondelete="CASCADE"),
        nullable=False,
    )

    booking_reference: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    booking_status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status"),
        nullable=False,
        default=BookingStatus.awaiting_payment,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status"),
        nullable=False,
        default=PaymentStatus.unpaid,
    )

    participants_count: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)

    booking_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reserved_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    cancelled_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    cancellation_reason: Mapped[str | None] = mapped_column(String(500), nullable=True)
    booking_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    package_title_snapshot: Mapped[str] = mapped_column(String(255), nullable=False)
    provider_name_snapshot: Mapped[str] = mapped_column(String(255), nullable=False)
    event_date_snapshot: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # tourist = relationship("User", back_populates="bookings")
    tourist = relationship(
        "User",
        back_populates="bookings",
        foreign_keys=[tourist_id],
    )
    package = relationship("Package", back_populates="bookings")
    participants = relationship(
        "BookingParticipant",
        back_populates="booking",
        cascade="all, delete-orphan",
    )
    payments = relationship(
        "Payment",
        back_populates="booking",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_bookings_tourist_id", "tourist_id"),
        Index("ix_bookings_package_id", "package_id"),
        Index("ix_bookings_booking_status", "booking_status"),
        Index("ix_bookings_payment_status", "payment_status"),
        Index("ix_bookings_reserved_until", "reserved_until"),
    )


