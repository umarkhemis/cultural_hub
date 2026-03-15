
from typing import Any


def success_response(
    message: str,
    data: Any = None,
    meta: dict | None = None,
) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
        "meta": meta or {},
    }


def error_response(
    message: str,
    errors: list[dict] | None = None,
    code: str | None = None,
) -> dict:
    return {
        "success": False,
        "message": message,
        "error": {
            "code": code,
            "details": errors or [],
        },
    }
