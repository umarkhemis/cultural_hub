
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
from app.modules.auth.service import login_user, logout_user, refresh_user_token, register_user, hash_token, create_refresh_token
from app.modules.users.service import get_current_user
from .jwt import create_access_token
from passlib.context import CryptContext

from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

from datetime import datetime, timedelta, timezone

from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.cache.redis import delete_cache, get_cache_raw, set_cache_raw
from app.core.config import settings
from app.database.dependencies import get_db
from app.models.cultural_site import CulturalSite, VerificationStatus
from app.models.refresh_token import RefreshToken
from app.models.user import User, UserRole
from app.modules.auth.schema import OAuthExchangeRequest
from app.modules.auth.service import _build_auth_payload
from app.utils.responses import success_response
from app.core.security import hash_password





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
def google_login(intent: str = "tourist"):
    if intent not in {"tourist", "provider"}:
        raise HTTPException(status_code=400, detail="Invalid Google auth intent")

    nonce = secrets.token_urlsafe(24)
    state = secrets.token_urlsafe(32)

    state_payload = {
        "nonce": nonce,
        "intent": intent,
    }

    set_cache_raw(
        key=f"google_oauth_state:{state}",
        value=json.dumps(state_payload),
        ttl_seconds=settings.GOOGLE_OAUTH_STATE_TTL_SECONDS,
    )

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
        "state": state,
    }

    return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


@router.get("/google/callback")
def google_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
):
    if error:
        raise HTTPException(status_code=400, detail=f"Google OAuth error: {error}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing Google authorization code")

    if not state:
        raise HTTPException(status_code=400, detail="Missing OAuth state")

    state_key = f"google_oauth_state:{state}"
    stored_state_raw = get_cache_raw(state_key)
    if not stored_state_raw:
        raise HTTPException(status_code=400, detail="Invalid or expired OAuth state")

    delete_cache(state_key)

    try:
        state_payload = json.loads(stored_state_raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid OAuth state payload")

    intent = state_payload.get("intent", "tourist")
    if intent not in {"tourist", "provider"}:
        intent = "tourist"

    with httpx.Client(timeout=15.0) as client:
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
            raise HTTPException(
                status_code=400,
                detail="Failed to exchange Google authorization code.",
            )

        google_tokens = token_response.json()

        userinfo_response = client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {google_tokens['access_token']}"},
        )

        if userinfo_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Google user info.")

        userinfo = userinfo_response.json()

    email = userinfo.get("email")
    email_verified = userinfo.get("email_verified", False)

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email.")

    if not email_verified:
        raise HTTPException(status_code=400, detail="Google email is not verified.")

    user = db.scalar(select(User).where(User.email == email.lower()))

    if not user:
        role = UserRole.provider if intent == "provider" else UserRole.tourist

        user = User(
            email=email.lower(),
            full_name=userinfo.get("name", "").strip() or email.split("@")[0],
            profile_image_url=userinfo.get("picture"),
            password_hash=hash_password(secrets.token_hex(32)),
            role=role,
            is_verified=True,
            is_active=True,
            last_login_at=datetime.now(timezone.utc),
        )
        db.add(user)
        db.flush()

        if role == UserRole.provider:
            # Create placeholder or leave site creation for completion flow
            # We keep completion flow external; no site auto-created here
            pass
    else:
        if not user.is_active:
            raise HTTPException(status_code=403, detail="This account is inactive.")

        if not user.profile_image_url and userinfo.get("picture"):
            user.profile_image_url = userinfo.get("picture")

        if not user.full_name and userinfo.get("name"):
            user.full_name = userinfo.get("name").strip()

        user.last_login_at = datetime.now(timezone.utc)

    raw_refresh_token = create_refresh_token()
    refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(raw_refresh_token),
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_token)
    db.commit()
    db.refresh(user)

    auth_payload = _build_auth_payload(user, raw_refresh_token)

    needs_site_details = False
    if user.role == UserRole.provider:
        site = getattr(user, "cultural_site", None)
        if site is None:
            needs_site_details = True

    exchange_code = secrets.token_urlsafe(32)
    set_cache_raw(
        key=f"google_oauth_exchange:{exchange_code}",
        value=json.dumps(
            {
                "auth_payload": auth_payload,
                "needs_site_details": needs_site_details,
            },
            default=str,
        ),
        ttl_seconds=settings.GOOGLE_OAUTH_EXCHANGE_CODE_TTL_SECONDS,
    )

    redirect_params = {"code": exchange_code}
    return RedirectResponse(
        url=f"{settings.FRONTEND_URL}/auth/callback?{urlencode(redirect_params)}"
    )


@router.post("/oauth/exchange")
def oauth_exchange(payload: OAuthExchangeRequest):
    key = f"google_oauth_exchange:{payload.code}"
    stored_raw = get_cache_raw(key)

    if not stored_raw:
        raise HTTPException(status_code=400, detail="Invalid or expired exchange code.")

    delete_cache(key)

    try:
        exchange_payload = json.loads(stored_raw)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid exchange payload.")

    return success_response(
        message="OAuth exchange completed successfully.",
        data=exchange_payload,
    )
































# @router.get("/google")
# def google_login(intent: str = "tourist"):
#     """
#     Start Google OAuth.
#     intent can be 'tourist' or 'provider'.
#     """
#     if intent not in {"tourist", "provider"}:
#         raise HTTPException(status_code=400, detail="Invalid Google auth intent")

#     state_payload = {
#         "nonce": secrets.token_urlsafe(16),
#         "intent": intent,
#     }
#     state = base64.urlsafe_b64encode(json.dumps(state_payload).encode()).decode()

#     params = {
#         "client_id": settings.GOOGLE_CLIENT_ID,
#         "redirect_uri": settings.GOOGLE_REDIRECT_URI,
#         "response_type": "code",
#         "scope": "openid email profile",
#         "access_type": "offline",
#         "prompt": "select_account",
#         "state": state,
#     }
#     return RedirectResponse(url=f"{GOOGLE_AUTH_URL}?{urlencode(params)}")


# @router.get("/google/callback")
# def google_callback(
#     code: str | None = None,
#     state: str | None = None,
#     error: str | None = None,
#     db: Session = Depends(get_db),
# ):
#     """
#     Complete Google OAuth, create/login user, then redirect to frontend.
#     """
#     if error:
#         raise HTTPException(status_code=400, detail=f"Google OAuth error: {error}")

#     if not code:
#         raise HTTPException(status_code=400, detail="Missing Google authorization code")

#     # Default intent
#     intent = "tourist"

#     # Recover intended role from state
#     if state:
#         try:
#             decoded_state = base64.urlsafe_b64decode(state + "=" * (-len(state) % 4)).decode()
#             state_payload = json.loads(decoded_state)
#             intent = state_payload.get("intent", "tourist")
#         except Exception:
#             intent = "tourist"

#     if intent not in {"tourist", "provider"}:
#         intent = "tourist"

#     with httpx.Client() as client:
#         token_response = client.post(
#             GOOGLE_TOKEN_URL,
#             data={
#                 "code": code,
#                 "client_id": settings.GOOGLE_CLIENT_ID,
#                 "client_secret": settings.GOOGLE_CLIENT_SECRET,
#                 "redirect_uri": settings.GOOGLE_REDIRECT_URI,
#                 "grant_type": "authorization_code",
#             },
#         )

#         if token_response.status_code != 200:
#             raise HTTPException(
#                 status_code=400,
#                 detail={
#                     "message": "Failed to exchange Google code for token",
#                     "google_status": token_response.status_code,
#                     "google_response": token_response.text,
#                 },
#             )

#         google_tokens = token_response.json()

#         userinfo_response = client.get(
#             GOOGLE_USERINFO_URL,
#             headers={"Authorization": f"Bearer {google_tokens['access_token']}"},
#         )

#         if userinfo_response.status_code != 200:
#             raise HTTPException(status_code=400, detail="Failed to fetch Google user info")

#         userinfo = userinfo_response.json()

#     email = userinfo.get("email")
#     if not email:
#         raise HTTPException(status_code=400, detail="Google account has no email")

#     user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

#     is_new_user = False
#     needs_site_details = False

#     if not user:
#         role = UserRole.provider if intent == "provider" else UserRole.tourist

#         user = User(
#             email=email,
#             full_name=userinfo.get("name", ""),
#             profile_image_url=userinfo.get("picture"),
#             password_hash=hash_password(secrets.token_hex(32)),
#             role=role,
#             is_verified=True,
#             is_active=True,
#         )
#         db.add(user)
#         db.commit()
#         db.refresh(user)
#         is_new_user = True

#     # Provider flow: if provider has no site, force completion step
#     if user.role == UserRole.provider:
#         site = getattr(user, "cultural_site", None)
#         if site is None:
#             needs_site_details = True

#     token = create_access_token(user.id)

#     user_payload = {
#         "id": str(user.id),
#         "email": user.email,
#         "full_name": user.full_name or "",
#         "role": user.role.value,
#         "phone": user.phone,
#         "profile_image_url": user.profile_image_url,
#         "is_active": user.is_active,
#         "is_verified": user.is_verified,
#     }

#     user_b64 = base64.urlsafe_b64encode(json.dumps(user_payload).encode()).decode()

#     redirect_params = {
#         "token": token,
#         "user": user_b64,
#     }

#     if needs_site_details:
#         redirect_params["needs_site_details"] = "true"

#     return RedirectResponse(
#         url=f"{settings.FRONTEND_URL}/auth/callback?{urlencode(redirect_params)}"
#     )



