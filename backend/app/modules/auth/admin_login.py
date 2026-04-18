
import hashlib
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.security import verify_password, create_access_token, create_refresh_token
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.utils.responses import success_response

limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger("admin.auth")
router = APIRouter(prefix="/auth", tags=["Admin Auth"])

ACCESS_DENIED_MSG = "Invalid credentials. Access denied."


class AdminLoginRequest(BaseModel):
    email:    EmailStr
    password: str
    totp:     str | None = None


def _log_attempt(request: Request, email: str, success: bool, reason: str = "") -> None:
    ip = request.client.host if request.client else "unknown"
    email_hash = hashlib.sha256(email.lower().encode()).hexdigest()[:16]
    logger.warning({
        "event":      "admin_login_attempt",
        "success":    success,
        "email_hash": email_hash,
        "ip":         ip,
        "reason":     reason,
        "timestamp":  datetime.utcnow().isoformat(),
    })


@router.post("/admin/login")
@limiter.limit("5/15 minutes")
def admin_login(
    body:    AdminLoginRequest,
    request: Request,
    db:      Session = Depends(get_db),
) -> dict:
    user = db.scalar(select(User).where(User.email == body.email.lower()))

    if not user:
        _log_attempt(request, body.email, False, "user_not_found")
        verify_password("dummy", "$2b$12$dummy_hash_to_waste_time_xxxxxxxxxxxxxxxxxxxxxxxxx")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=ACCESS_DENIED_MSG)

    if not verify_password(body.password, user.password_hash):
        _log_attempt(request, body.email, False, "wrong_password")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=ACCESS_DENIED_MSG)

    if user.role != UserRole.admin:
        _log_attempt(request, body.email, False, f"wrong_role:{user.role}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=ACCESS_DENIED_MSG)

    if not user.is_active:
        _log_attempt(request, body.email, False, "account_inactive")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=ACCESS_DENIED_MSG)

    # if user.totp_enabled:
    #     if not body.totp:
    #         return success_response(
    #             message="TOTP required.",
    #             data={"requires_totp": True},
    #         )
    #     import pyotp
    #     totp = pyotp.TOTP(user.totp_secret)
    #     if not totp.verify(body.totp, valid_window=1):
    #         _log_attempt(request, body.email, False, "wrong_totp")
    #         raise HTTPException(status_code=401, detail=ACCESS_DENIED_MSG)

    access_token  = create_access_token(str(user.id), user.role)
    refresh_token = create_refresh_token()

    _log_attempt(request, body.email, True)

    return success_response(
        message="Access granted.",
        data={
            "user": {
                "id":          str(user.id),
                "full_name":   user.full_name,
                "email":       user.email,
                "role":        user.role,
                "is_active":   user.is_active,
                "is_verified": user.is_verified,
            },
            "tokens": {
                "access_token":  access_token,
                "refresh_token": refresh_token,
            },
            "requires_totp": False,
        },
    )