
from datetime import datetime, timezone
import secrets


def generate_booking_reference() -> str:
    prefix = datetime.now(timezone.utc).strftime("BK%Y%m%d")
    suffix = secrets.token_hex(3).upper()
    return f"{prefix}-{suffix}"


