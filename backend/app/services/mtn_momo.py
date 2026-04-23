
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
    token = _get_auth_token()
    reference_id = str(uuid_lib.uuid4())

    # Normalize phone number
    normalized = phone_number.strip()
    if normalized.startswith("+"):
        normalized = normalized[1:]
    elif normalized.startswith("0"):
        normalized = "256" + normalized[1:]

    payload = {
        "amount": amount,
        "currency": currency,
        "externalId": external_id,
        "payer": {
            "partyIdType": "MSISDN",
            "partyId": normalized,
        },
        "payerMessage": payer_message,
        "payeeNote": payee_note,
    }

    response = httpx.post(
        f"{settings.MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay",
        headers={
            "Authorization": f"Bearer {token}",
            "X-Reference-Id": reference_id,
            "X-Target-Environment": settings.MTN_MOMO_ENVIRONMENT,
            "Ocp-Apim-Subscription-Key": settings.MTN_MOMO_SUBSCRIPTION_KEY,
            "Content-Type": "application/json",
        },
        json=payload,
    )

    # Log full error details from MTN
    if response.status_code >= 400:
        raise ValueError(
            f"MTN MoMo error {response.status_code}: {response.text} | Payload sent: {payload}"
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

    if response.status_code == 404:
        # Reference not found — treat as still pending
        return {"status": "PENDING", "reason": "not_found"}

    if response.status_code >= 400:
        raise ValueError(f"MTN MoMo status check error {response.status_code}: {response.text}")

    return response.json()