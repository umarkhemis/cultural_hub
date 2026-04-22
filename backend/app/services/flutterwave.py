
import hmac
import hashlib

import httpx

from app.core.config import settings

FLW_BASE = "https://api.flutterwave.com/v3"


def _headers() -> dict:
    return {
        "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
        "Content-Type": "application/json",
    }


def create_payment_link(
    amount: float,
    currency: str,
    email: str,
    name: str,
    phone: str,
    tx_ref: str,
    redirect_url: str,
    description: str = "CulturalHub booking",
) -> str:
    """
    Create a Flutterwave hosted payment link.
    Returns the payment URL to redirect the user to.
    """
    response = httpx.post(
        f"{FLW_BASE}/payments",
        headers=_headers(),
        json={
            "tx_ref": tx_ref,
            "amount": amount,
            "currency": currency,
            "redirect_url": redirect_url,
            "customer": {
                "email": email,
                "name": name,
                "phonenumber": phone,
            },
            "customizations": {
                "title": "CulturalHub",
                "description": description,
                "logo": "https://yourdomain.com/logo.png",
            },
            "payment_options": "card,mobilemoneyuganda",
        },
    )
    response.raise_for_status()
    data = response.json()
    return data["data"]["link"]


def verify_transaction(transaction_id: str) -> dict:
    """Verify a Flutterwave transaction by ID."""
    response = httpx.get(
        f"{FLW_BASE}/transactions/{transaction_id}/verify",
        headers=_headers(),
    )
    response.raise_for_status()
    return response.json()


def verify_webhook_signature(payload_bytes: bytes, signature: str) -> bool:
    """Verify the Flutterwave webhook signature."""
    expected = hmac.new(
        settings.FLUTTERWAVE_WEBHOOK_SECRET.encode(),
        payload_bytes,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)