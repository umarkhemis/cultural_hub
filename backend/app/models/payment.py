
import enum
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from app.models.booking import PaymentStatus


class PaymentGateway(str, enum.Enum):
    mock = "mock"
    mtn_momo = "mtn_momo"
    flutterwave = "flutterwave"
    mobile_money = "mobile_money"
    pesapal = "pesapal"


class Payment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "payments"

    booking_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
    )

    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="UGX")
    payment_gateway: Mapped[PaymentGateway] = mapped_column(
        Enum(PaymentGateway, name="payment_gateway"),
        nullable=False,
        default=PaymentGateway.mock,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_record_status"),
        nullable=False,
        default=PaymentStatus.pending,
    )

    transaction_reference: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )
    gateway_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    gateway_transaction_id: Mapped[str | None] = mapped_column(String(200), nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(30), nullable=True)
    payment_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    pesapal_order_tracking_id: Mapped[str | None] = mapped_column(String(200), nullable=True)

    booking = relationship("Booking", back_populates="payments")

    __table_args__ = (
        Index("ix_payments_booking_id", "booking_id"),
        Index("ix_payments_payment_status", "payment_status"),
    )


