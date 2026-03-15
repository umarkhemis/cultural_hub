
import enum
import uuid

from sqlalchemy import Enum, ForeignKey, Index, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class PaymentGateway(str, enum.Enum):
    mock = "mock"
    manual = "manual"
    flutterwave = "flutterwave"
    paystack = "paystack"
    stripe = "stripe"


class PaymentRecordStatus(str, enum.Enum):
    initialized = "initialized"
    pending = "pending"
    completed = "completed"
    failed = "failed"
    refunded = "refunded"


class Payment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "payments"

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
    )
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="UGX")
    payment_gateway: Mapped[PaymentGateway] = mapped_column(
        Enum(PaymentGateway, name="payment_gateway"),
        nullable=False,
        default=PaymentGateway.mock,
    )
    payment_status: Mapped[PaymentRecordStatus] = mapped_column(
        Enum(PaymentRecordStatus, name="payment_record_status"),
        nullable=False,
        default=PaymentRecordStatus.initialized,
    )
    transaction_reference: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    gateway_response: Mapped[str | None] = mapped_column(String(2000), nullable=True)

    booking = relationship("Booking")

    __table_args__ = (
        Index("ix_payments_booking_id", "booking_id"),
        Index("ix_payments_payment_status", "payment_status"),
        Index("ix_payments_gateway", "payment_gateway"),
        Index("ix_payments_created_at", "created_at"),
        Index("ix_payments_booking_status", "booking_id", "payment_status"),
    )
