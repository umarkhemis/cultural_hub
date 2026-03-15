
from pydantic import BaseModel, Field


class PaymentInitializeRequest(BaseModel):
    booking_id: str
    payment_gateway: str = Field(default="mock")
    currency: str = Field(default="UGX", min_length=3, max_length=10)


class MockWebhookRequest(BaseModel):
    transaction_reference: str
    payment_status: str = Field(description="completed or failed")
    gateway_response: str | None = None
