
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.database.dependencies import get_db
from app.models.user import User
from app.utils.exceptions import UnauthorizedException
# from app.core.security import decode_access

optional_bearer_scheme = HTTPBearer(auto_error=False)

bearer_scheme = HTTPBearer(auto_error=True)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials

    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise UnauthorizedException("Invalid access token.") from exc

    if payload.get("type") != "access":
        raise UnauthorizedException("Invalid token type.")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Token subject missing.")

    user = db.get(User, user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or inactive.")

    return user


def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer_scheme),
    db: Session = Depends(get_db),
) -> User | None:
    if credentials is None:
        return None

    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        return None

    user = db.get(User, user_id)
    return user































# from fastapi import Depends, HTTPException, status
# from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
# from sqlalchemy.orm import Session

# from app.core.security import decode_token
# from app.database.dependencies import get_db
# from app.models.user import User

# bearer_scheme = HTTPBearer(auto_error=True)


# def get_current_user(
#     credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
#     db: Session = Depends(get_db),
# ) -> User:
#     token = credentials.credentials

#     try:
#         payload = decode_token(token)
#     except ValueError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid access token.",
#         )

#     if payload.get("type") != "access":
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token type.",
#         )

#     user_id = payload.get("sub")
#     if not user_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Token subject missing.",
#         )

#     user = db.get(User, user_id)
#     if not user or not user.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="User not found or inactive.",
#         )

#     return user
