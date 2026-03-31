
import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.payment import PaymentGateway


class PaymentInitializeRequest(BaseModel):
    booking_id: uuid.UUID
    payment_gateway: PaymentGateway = PaymentGateway.mock
    currency: str = Field(default="UGX", max_length=10)


class MockPaymentWebhookRequest(BaseModel):
    transaction_reference: str = Field(min_length=5, max_length=100)
    payment_status: str = Field(min_length=3, max_length=30)
    gateway_response: str | None = Field(default=None, max_length=1000)


class PaymentResponse(BaseModel):
    id: str
    booking_id: str
    amount: Decimal
    currency: str
    payment_gateway: str
    payment_status: str
    transaction_reference: str
    gateway_response: str | None
    paid_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True