
from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.modules.auth.schema import AuthResponse, LoginRequest, RefreshRequest, RegisterRequest
from app.modules.auth.service import login_user, logout_user, refresh_user_token, register_user
from app.modules.users.service import get_current_user
from app.models.user import User
from app.utils.responses import success_response

from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

limiter = Limiter(key_func=get_remote_address)

@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit(f"{settings.RATE_LIMIT_REGISTER_PER_HOUR}/hour")
def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
    result = register_user(
        db=db,
        payload=payload,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return success_response(
        message="Registration successful.",
        data=result,
    )


@router.post("/login")
@limiter.limit(f"{settings.RATE_LIMIT_LOGIN_PER_MINUTE}/minute")
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(
        db=db,
        payload=payload,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )
    return success_response(
        message="Login successful.",
        data=result,
    )


@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    result = refresh_user_token(db=db, raw_refresh_token=payload.refresh_token)
    return success_response(
        message="Token refreshed successfully.",
        data=result,
    )


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































# from fastapi import APIRouter, Depends, Request, status
# from sqlalchemy.orm import Session

# from app.database.dependencies import get_db
# from app.modules.auth.schema import (
#     AuthResponse,
#     LoginRequest,
#     RefreshRequest,
#     RegisterRequest,
# )
# from app.modules.auth.service import (
#     login_user,
#     logout_user,
#     refresh_user_token,
#     register_user,
# )
# from app.modules.users.service import get_current_user
# from app.models.user import User

# router = APIRouter(prefix="/auth", tags=["Authentication"])


# @router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
# def register(payload: RegisterRequest, request: Request, db: Session = Depends(get_db)):
#     return register_user(
#         db=db,
#         payload=payload,
#         user_agent=request.headers.get("user-agent"),
#         ip_address=request.client.host if request.client else None,
#     )


# @router.post("/login", response_model=AuthResponse)
# def login(payload: LoginRequest, request: Request, db: Session = Depends(get_db)):
#     return login_user(
#         db=db,
#         payload=payload,
#         user_agent=request.headers.get("user-agent"),
#         ip_address=request.client.host if request.client else None,
#     )


# @router.post("/refresh", response_model=AuthResponse)
# def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
#     return refresh_user_token(db=db, raw_refresh_token=payload.refresh_token)


# @router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
# def logout(payload: RefreshRequest, db: Session = Depends(get_db)):
#     logout_user(db=db, raw_refresh_token=payload.refresh_token)
#     return None


# @router.get("/me")
# def me(current_user: User = Depends(get_current_user)):
#     return {
#         "id": str(current_user.id),
#         "full_name": current_user.full_name,
#         "email": current_user.email,
#         "role": current_user.role.value,
#         "phone": current_user.phone,
#         "profile_image_url": current_user.profile_image_url,
#         "is_active": current_user.is_active,
#         "is_verified": current_user.is_verified,
#     }
