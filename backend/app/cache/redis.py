
import json
import logging
from typing import Any

import redis
from redis.exceptions import RedisError

from app.core.config import settings

logger = logging.getLogger(__name__)

redis_client = None

if settings.REDIS_URL:
    try:
        redis_client = redis.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
        )
    except Exception as exc:
        logger.warning("Redis client initialization failed: %s", exc)
        redis_client = None


def get_cache(key: str) -> Any | None:
    if redis_client is None:
        return None

    try:
        value = redis_client.get(key)
        if value is None:
            return None
        return json.loads(value)
    except (RedisError, json.JSONDecodeError, TypeError) as exc:
        logger.warning("Redis get failed for key=%s: %s", key, exc)
        return None


def set_cache(key: str, value: Any, ttl_seconds: int = 60) -> None:
    if redis_client is None:
        return

    try:
        redis_client.setex(
            key,
            ttl_seconds,
            json.dumps(value, default=str),
        )
    except (RedisError, TypeError, ValueError) as exc:
        logger.warning("Redis set failed for key=%s: %s", key, exc)


def delete_cache(key: str) -> None:
    if redis_client is None:
        return

    try:
        redis_client.delete(key)
    except RedisError as exc:
        logger.warning("Redis delete failed for key=%s: %s", key, exc)


def delete_cache_by_pattern(pattern: str) -> None:
    if redis_client is None:
        return

    try:
        cursor = 0
        while True:
            cursor, keys = redis_client.scan(
                cursor=cursor,
                match=pattern,
                count=100,
            )
            if keys:
                redis_client.delete(*keys)
            if cursor == 0:
                break
    except RedisError as exc:
        logger.warning("Redis pattern delete failed for pattern=%s: %s", pattern, exc)




































# import json
# import logging

# import redis
# from redis.exceptions import RedisError

# from app.core.config import settings

# logger = logging.getLogger(__name__)

# redis_client = redis.Redis.from_url(
#     settings.REDIS_URL,
#     decode_responses=True,
# )


# def get_cache(key: str):
#     try:
#         value = redis_client.get(key)
#         if value is None:
#             return None
#         return json.loads(value)
#     except RedisError as exc:
#         logger.warning("Redis get failed for key=%s: %s", key, exc)
#         return None


# def set_cache(key: str, value, ttl_seconds: int = 60):
#     try:
#         redis_client.setex(key, ttl_seconds, json.dumps(value, default=str))
#     except RedisError as exc:
#         logger.warning("Redis set failed for key=%s: %s", key, exc)


# def delete_cache(key: str):
#     try:
#         redis_client.delete(key)
#     except RedisError as exc:
#         logger.warning("Redis delete failed for key=%s: %s", key, exc)


# def delete_cache_by_pattern(pattern: str):
#     try:
#         keys = redis_client.keys(pattern)
#         if keys:
#             redis_client.delete(*keys)
#     except RedisError as exc:
#         logger.warning("Redis pattern delete failed for pattern=%s: %s", pattern, exc)