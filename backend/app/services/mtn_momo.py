
import base64
import uuid as uuid_lib
from datetime import datetime, timezone

import httpx

from app.core.config import settings


def _get_auth_token() -> str:
    """Get MTN MoMo OAuth token."""
    credentials = base64.b64encode(
        f"{settings.MTN_MOMO_API_USER}:{settings.MTN_MOMO_API_KEY}".encode()
    ).decode()

    response = httpx.post(
        f"{settings.MTN_MOMO_BASE_URL}/collection/token/",
        headers={
            "Authorization": f"Basic {credentials}",
            "Ocp-Apim-Subscription-Key": settings.MTN_MOMO_SUBSCRIPTION_KEY,
        },
    )
    response.raise_for_status()
    return response.json()["access_token"]


def request_payment(
    amount: str,
    currency: str,
    phone_number: str,
    external_id: str,
    payer_message: str = "Payment for booking",
    payee_note: str = "CulturalHub booking payment",
) -> dict:
    """
    Initiate a MoMo collection request.
    Returns the reference_id (use this to check status).
    """
    token = _get_auth_token()
    reference_id = str(uuid_lib.uuid4())

    # Normalize phone: strip leading 0 or +256, ensure 256XXXXXXXXX
    normalized = phone_number.strip()
    if normalized.startswith("+"):
        normalized = normalized[1:]
    elif normalized.startswith("0"):
        normalized = "256" + normalized[1:]

    response = httpx.post(
        f"{settings.MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay",
        headers={
            "Authorization": f"Bearer {token}",
            "X-Reference-Id": reference_id,
            "X-Target-Environment": settings.MTN_MOMO_ENVIRONMENT,
            "Ocp-Apim-Subscription-Key": settings.MTN_MOMO_SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
        },
        json={
            "amount": amount,
            "currency": currency,
            "externalId": external_id,
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": normalized,
            },
            "payerMessage": payer_message,
            "payeeNote": payee_note,
        },
    )
    response.raise_for_status()

    return {"reference_id": reference_id, "status": "pending"}


def check_payment_status(reference_id: str) -> dict:
    """Check the status of a MoMo payment."""
    token = _get_auth_token()

    response = httpx.get(
        f"{settings.MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay/{reference_id}",
        headers={
            "Authorization": f"Bearer {token}",
            "X-Target-Environment": settings.MTN_MOMO_ENVIRONMENT,
            "Ocp-Apim-Subscription-Key": settings.MTN_MOMO_SUBSCRIPTION_KEY,
        },
    )
    response.raise_for_status()
    return response.json()
    # Returns: {"status": "SUCCESSFUL" | "FAILED" | "PENDING", ...}