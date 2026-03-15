
class AppException(Exception):
    def __init__(
        self,
        message: str,
        code: str = "APPLICATION_ERROR",
        status_code: int = 400,
        details: list[dict] | None = None,
    ) -> None:
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or []
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found.") -> None:
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=404,
        )


class ForbiddenException(AppException):
    def __init__(self, message: str = "You do not have permission to perform this action.") -> None:
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=403,
        )


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required.") -> None:
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=401,
        )


class ConflictException(AppException):
    def __init__(self, message: str = "Resource conflict.") -> None:
        super().__init__(
            message=message,
            code="CONFLICT",
            status_code=409,
        )


class ValidationException(AppException):
    def __init__(self, message: str = "Validation failed.", details: list[dict] | None = None) -> None:
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=422,
            details=details,
        )
