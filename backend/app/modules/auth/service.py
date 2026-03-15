
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.cultural_site import CulturalSite, VerificationStatus
from app.models.refresh_token import RefreshToken
from app.models.user import User, UserRole
from app.modules.auth.schema import LoginRequest, RegisterRequest
from app.utils.exceptions import ConflictException, UnauthorizedException, ValidationException


def _build_auth_payload(user: User, refresh_token: str) -> dict:
    access_token = create_access_token(str(user.id), user.role.value)
    return {
        "user": user,
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        },
    }


# def register_user(
#     db: Session,
#     payload: RegisterRequest,
#     user_agent: str | None = None,
#     ip_address: str | None = None,
# ) -> dict:
#     existing_user = db.scalar(select(User).where(User.email == payload.email.lower()))
#     if existing_user:
#         raise ConflictException("An account with this email already exists.")

#     role = UserRole(payload.role)

#     if role == UserRole.provider and not payload.site_name:
#         raise ValidationException("site_name is required for provider registration.")

#     user = User(
#         full_name=payload.full_name.strip(),
#         email=payload.email.lower(),
#         phone=payload.phone,
#         password_hash=hash_password(payload.password),
#         role=role,
#         is_active=True,
#         is_verified=False,
#     )
#     db.add(user)
#     db.flush()

#     if role == UserRole.provider:
#         site = CulturalSite(
#             user_id=user.id,
#             site_name=payload.site_name.strip(),
#             description=payload.description,
#             location=payload.location,
#             contact_email=payload.contact_email or payload.email.lower(),
#             contact_phone=payload.contact_phone or payload.phone,
#             verification_status=VerificationStatus.pending,
#             is_active=True,
#         )
#         db.add(site)

#     raw_refresh_token = create_refresh_token()
#     refresh_token = RefreshToken(
#         user_id=user.id,
#         token_hash=hash_token(raw_refresh_token),
#         user_agent=user_agent,
#         ip_address=ip_address,
#         expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
#     )
#     db.add(refresh_token)

#     db.commit()
#     db.refresh(user)

#     return _build_auth_payload(user, raw_refresh_token)




def register_user(
    db: Session,
    payload: RegisterRequest,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> dict:
    existing_user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing_user:
        raise ConflictException("An account with this email already exists.")

    role = UserRole(payload.role)

    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role=role,
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    db.flush()

    if role == UserRole.provider:
        site = CulturalSite(
            user_id=user.id,
            site_name=payload.site_name,
            description=payload.description,
            location=payload.location,
            contact_email=(payload.contact_email.lower() if payload.contact_email else None) or payload.email.lower(),
            contact_phone=payload.contact_phone or payload.phone,
            verification_status=VerificationStatus.pending,
            is_active=True,
        )
        db.add(site)

    raw_refresh_token = create_refresh_token()
    refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(raw_refresh_token),
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_token)

    db.commit()
    db.refresh(user)

    return _build_auth_payload(user, raw_refresh_token)






def login_user(
    db: Session,
    payload: LoginRequest,
    user_agent: str | None = None,
    ip_address: str | None = None,
) -> dict:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.password_hash):
        raise UnauthorizedException("Invalid email or password.")

    if not user.is_active:
        raise UnauthorizedException("This account is inactive.")

    user.last_login_at = datetime.now(timezone.utc)

    raw_refresh_token = create_refresh_token()
    refresh_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(raw_refresh_token),
        user_agent=user_agent,
        ip_address=ip_address,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(refresh_token)

    db.commit()
    db.refresh(user)

    return _build_auth_payload(user, raw_refresh_token)


def refresh_user_token(db: Session, raw_refresh_token: str) -> dict:
    token_hash = hash_token(raw_refresh_token)
    stored = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == token_hash))

    if not stored or stored.revoked_at is not None:
        raise UnauthorizedException("Invalid refresh token.")

    if stored.expires_at < datetime.now(timezone.utc):
        raise UnauthorizedException("Refresh token expired.")

    user = db.get(User, stored.user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or inactive.")

    new_refresh_raw = create_refresh_token()
    stored.revoked_at = datetime.now(timezone.utc)

    replacement = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(new_refresh_raw),
        user_agent=stored.user_agent,
        ip_address=stored.ip_address,
        expires_at=datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
    )
    db.add(replacement)
    db.commit()
    db.refresh(user)

    return _build_auth_payload(user, new_refresh_raw)


def logout_user(db: Session, raw_refresh_token: str) -> None:
    token_hash = hash_token(raw_refresh_token)
    stored = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    if stored and stored.revoked_at is None:
        stored.revoked_at = datetime.now(timezone.utc)
        db.commit()

























