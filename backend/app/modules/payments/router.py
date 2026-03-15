
import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.payments.schema import MockWebhookRequest, PaymentInitializeRequest
from app.modules.payments.serializers import serialize_payment
from app.modules.payments.service import (
    get_payment_detail_for_owner,
    initialize_payment,
    process_mock_webhook,
)
from app.utils.responses import success_response

router = APIRouter(prefix="/payments", tags=["Payments"])


@router.post("/initialize", status_code=status.HTTP_201_CREATED)
def initialize_payment_endpoint(
    payload: PaymentInitializeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    payment = initialize_payment(db=db, current_user=current_user, payload=payload)
    return success_response(
        message="Payment initialized successfully.",
        data=serialize_payment(payment),
    )


@router.post("/webhook/mock")
def mock_webhook_endpoint(
    payload: MockWebhookRequest,
    db: Session = Depends(get_db),
):
    payment = process_mock_webhook(db=db, payload=payload)
    return success_response(
        message="Mock payment webhook processed successfully.",
        data=serialize_payment(payment),
    )


@router.get("/{payment_id}")
def payment_detail_endpoint(
    payment_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist, UserRole.provider, UserRole.admin)),
):
    payment = get_payment_detail_for_owner(db=db, current_user=current_user, payment_id=payment_id)
    return success_response(
        message="Payment retrieved successfully.",
        data=serialize_payment(payment),
    )
