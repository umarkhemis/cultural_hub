
from collections.abc import Callable

from fastapi import Depends

from app.models.user import User, UserRole
from app.modules.users.service import get_current_user
from app.utils.exceptions import ForbiddenException


def require_roles(*allowed_roles: UserRole) -> Callable:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException("You do not have permission to access this resource.")
        return current_user

    return dependency
