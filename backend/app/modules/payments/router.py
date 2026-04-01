
import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.payment import PaymentGateway
from app.models.user import User, UserRole
from app.modules.payments.schema import (
    MockPaymentWebhookRequest,
    PaymentInitializeRequest,
)
from app.modules.payments.service import (
    get_payment_detail,
    initialize_payment,
    process_mock_payment_webhook,
)
from app.utils.responses import success_response
from app.modules.payments.serializers import serialize_payment

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/initialize", status_code=status.HTTP_201_CREATED)
def initialize_payment_endpoint(
    payload: PaymentInitializeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    payment = initialize_payment(
        db=db,
        current_user=current_user,
        booking_id=payload.booking_id,
        payment_gateway=payload.payment_gateway,
        currency=payload.currency,
    )
    return success_response(
        message="Payment initialized successfully.",
        data=serialize_payment(payment)
        # data=payment,
    )


@router.post("/webhook/mock")
def process_mock_webhook_endpoint(
    payload: MockPaymentWebhookRequest,
    db: Session = Depends(get_db),
):
    payment = process_mock_payment_webhook(
        db=db,
        transaction_reference=payload.transaction_reference,
        payment_status=payload.payment_status,
        gateway_response=payload.gateway_response,
    )
    return success_response(
        message="Mock payment webhook processed successfully.",
        data=serialize_payment(payment)
        # data=payment,
    )


@router.get("/{payment_id}")
def payment_detail_endpoint(
    payment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist, UserRole.admin)),
):
    payment = get_payment_detail(
        db=db,
        payment_id=payment_id,
        current_user=current_user,
    )
    return success_response(
        message="Payment retrieved successfully.",
        data=serialize_payment(payment)
        # data=payment,
    )