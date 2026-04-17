
from fastapi import APIRouter, Depends, Request, Response, status, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse
import httpx
import secrets
import json
import base64
from urllib.parse import urlencode

from app.database.dependencies import get_db
from app.modules.auth.schema import LoginRequest, RefreshRequest, RegisterRequest
from app.modules.auth.service import login_user, logout_user, refresh_user_token, register_user
from app.modules.users.service import get_current_user
from app.models.user import User
from app.utils.responses import success_response
from .jwt import create_access_token
from passlib.context import CryptContext
from sqlalchemy import select

from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"


def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── Standard Auth ────────────────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit(f"{settings.RATE_LIMIT_REGISTER_PER_HOUR}/hour")
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    result = register_user(
        db=db,
        payload=payload,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return success_response(message="Registration successful.", data=result)


@router.post("/login")
@limiter.limit(f"{settings.RATE_LIMIT_LOGIN_PER_MINUTE}/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(
        db=db,
        payload=payload,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return success_response(message="Login successful.", data=result)


@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    result = refresh_user_token(db=db, raw_refresh_token=payload.refresh_token)
    return success_response(message="Token refreshed successfully.", data=result)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
    logout_user(db=db, raw_refresh_token=payload.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return success_response(
        message="Current user retrieved successfully.",
        data={
            "id": str(current_user.id),
            "full_name": current_user.full_name,
            "email": current_user.email,
            "role": current_user.role.value,
            "phone": current_user.phone,
            "profile_image_url": current_user.profile_image_url,
            "is_active": current_user.is_active,
            "is_verified": current_user.is_verified,
        },
    )


# ─── Google OAuth ─────────────────────────────────────────────────────────────

@router.get("/google")
def google_login():
    """Redirect user to Google's OAuth consent screen."""
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
        "state": secrets.token_urlsafe(16),
    }
    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    """Handle Google OAuth callback, create/login user, redirect to frontend."""

    # Exchange authorization code for Google tokens
    with httpx.Client() as client:
        token_response = client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
        )
        if token_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange Google code for token")

        google_tokens = token_response.json()

        # Fetch user profile from Google
        userinfo_response = client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_tokens['access_token']}"},
        )
        if userinfo_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Google user info")

        userinfo = userinfo_response.json()

    email: str = userinfo.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    # Find existing user or create a new one
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if not user:
        user = User(
            email=email,
            full_name=userinfo.get("name", ""),
            profile_image_url=userinfo.get("picture"),
            hashed_password=hash_password(secrets.token_hex(32)),
            is_verified=True,  # Google already verified this email
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Build app JWT
    token = create_access_token(user.id)

    # Encode user payload as base64 so the frontend can skip a /me round-trip
    user_payload = {
        "id": str(user.id),
        "email": user.email,
        "full_name": user.full_name or "",
        "role": user.role.value,
        "phone": user.phone,
        "profile_image_url": user.profile_image_url,
        "is_active": user.is_active,
        "is_verified": user.is_verified,
    }
    user_b64 = base64.urlsafe_b64encode(
        json.dumps(user_payload).encode()
    ).decode()

    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?token={token}&user={user_b64}"
    )



