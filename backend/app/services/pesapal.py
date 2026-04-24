
import httpx
from app.core.config import settings

_cached_token: dict = {}


def _get_auth_token() -> str:
    response = httpx.post(
        f"{settings.PESAPAL_BASE_URL}/api/Auth/RequestToken",
        json={
            "consumer_key": settings.PESAPAL_CONSUMER_KEY,
            "consumer_secret": settings.PESAPAL_CONSUMER_SECRET,
        },
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )

    if response.status_code >= 400:
        raise ValueError(f"Pesapal auth failed {response.status_code}: {response.text}")

    data = response.json()

    if data.get("status") != "200" or not data.get("token"):
        raise ValueError(f"Pesapal auth error: {data.get('error', {}).get('message', 'Unknown error')}")

    return data["token"]


def _headers() -> dict:
    token = _get_auth_token()
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def register_ipn() -> str:
    """
    Register your IPN (Instant Payment Notification) URL with Pesapal.
    Call this once during setup. Returns the ipn_id.
    """
    response = httpx.post(
        f"{settings.PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN",
        headers=_headers(),
        json={
            "url": settings.PESAPAL_IPN_URL,
            "ipn_notification_type": "POST",
        },
    )

    if response.status_code >= 400:
        raise ValueError(f"Pesapal IPN registration failed: {response.text}")

    data = response.json()
    return data["ipn_id"]


def submit_order(
    order_id: str,
    amount: float,
    currency: str,
    description: str,
    email: str,
    phone: str,
    first_name: str,
    last_name: str,
    ipn_id: str,
    callback_url: str,
) -> dict:
    """
    Submit a payment order to Pesapal.
    Returns redirect_url to send the user to.
    """
    response = httpx.post(
        f"{settings.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest",
        headers=_headers(),
        json={
            "id": order_id,
            "currency": currency,
            "amount": amount,
            "description": description,
            "callback_url": callback_url,
            "notification_id": ipn_id,
            "billing_address": {
                "email_address": email,
                "phone_number": phone,
                "first_name": first_name,
                "last_name": last_name,
                "country_code": "UG",
            },
        },
    )

    if response.status_code >= 400:
        raise ValueError(f"Pesapal order submission failed {response.status_code}: {response.text}")

    data = response.json()
    return {
        "redirect_url": data["redirect_url"],
        "order_tracking_id": data["order_tracking_id"],
    }


def get_transaction_status(order_tracking_id: str) -> dict:
    """Check the status of a Pesapal transaction."""
    response = httpx.get(
        f"{settings.PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus",
        headers=_headers(),
        params={"orderTrackingId": order_tracking_id},
    )

    if response.status_code >= 400:
        raise ValueError(f"Pesapal status check failed {response.status_code}: {response.text}")

    return response.json()
    # Returns: payment_status_description: "Completed" | "Failed" | "Pending" | "Invalid"