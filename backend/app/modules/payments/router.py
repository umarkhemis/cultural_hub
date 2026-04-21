
import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.payments.schema import (
    MockPaymentWebhookRequest,
    PaymentInitializeRequest,
)
from app.modules.payments.service import (
    get_payment_by_id,
    initialize_payment,
    process_mock_payment_webhook,
)
from app.modules.users.service import get_current_user
from app.utils.responses import success_response

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
        data=payment,
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
        data=payment,
    )


@router.get("/{payment_id}")
def get_payment_detail_endpoint(
    payment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = get_payment_by_id(db=db, payment_id=payment_id, current_user=current_user)
    return success_response(
        message="Payment retrieved successfully.",
        data=payment,
    )

