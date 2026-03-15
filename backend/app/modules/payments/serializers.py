
from app.models.payment import Payment


def serialize_payment(payment: Payment) -> dict:
    return {
        "id": str(payment.id),
        "booking_id": str(payment.booking_id),
        "amount": float(payment.amount),
        "currency": payment.currency,
        "payment_gateway": payment.payment_gateway.value,
        "payment_status": payment.payment_status.value,
        "transaction_reference": payment.transaction_reference,
        "gateway_response": payment.gateway_response,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at,
    }
