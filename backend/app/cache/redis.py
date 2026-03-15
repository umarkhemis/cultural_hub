
import json
from typing import Any

import redis

from app.core.config import settings

redis_client = redis.Redis.from_url(
    settings.REDIS_URL,
    decode_responses=True,
)


def get_cache(key: str) -> Any | None:
    value = redis_client.get(key)
    if value is None:
        return None
    return json.loads(value)


def set_cache(key: str, value: Any, ttl_seconds: int) -> None:
    redis_client.setex(
        key,
        ttl_seconds,
        json.dumps(value, default=str),
    )


def delete_cache(key: str) -> None:
    redis_client.delete(key)


def delete_cache_by_pattern(pattern: str) -> None:
    cursor = 0
    while True:
        cursor, keys = redis_client.scan(cursor=cursor, match=pattern, count=100)
        if keys:
            redis_client.delete(*keys)
        if cursor == 0:
            break