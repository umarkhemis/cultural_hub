
import uuid

from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.models.notification import Notification, NotificationType
from app.models.user import User
from app.utils.exceptions import ForbiddenException, NotFoundException
from app.cache.keys import notifications_key
from app.cache.redis import delete_cache_by_pattern, get_cache, set_cache
from app.core.config import settings


def create_notification(
    db: Session,
    user_id: uuid.UUID,
    notification_type: NotificationType,
    title: str,
    message: str,
    related_entity_id: str | None = None,
) -> Notification:
    notification = Notification(
        user_id=user_id,
        notification_type=notification_type,
        title=title,
        message=message,
        related_entity_id=related_entity_id,
        is_read=False,
    )
    db.add(notification)
    delete_cache_by_pattern(f"notifications:{user_id}:*")
    return notification


def list_user_notifications(db: Session, current_user: User, limit: int = 20) -> list[Notification] | list[dict]:
    limit = min(max(limit, 1), 100)
    cache_key = notifications_key(str(current_user.id), limit)

    cached = get_cache(cache_key)
    if cached is not None:
        return cached

    notifications = db.scalars(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(desc(Notification.created_at))
        .limit(limit)
    ).all()

    result = list(notifications)
    set_cache(cache_key, [_serialize_notification_for_cache(item) for item in result], settings.NOTIFICATIONS_CACHE_TTL_SECONDS)
    return result


def _serialize_notification_for_cache(notification: Notification) -> dict:
    return {
        "id": str(notification.id),
        "notification_type": notification.notification_type.value,
        "title": notification.title,
        "message": notification.message,
        "related_entity_id": notification.related_entity_id,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat(),
    }


def mark_notification_as_read(db: Session, current_user: User, notification_id: uuid.UUID) -> Notification:
    notification = db.scalar(
        select(Notification).where(Notification.id == notification_id)
    )
    if not notification:
        raise NotFoundException("Notification not found.")

    if notification.user_id != current_user.id:
        raise ForbiddenException("You can only update your own notifications.")

    notification.is_read = True
    db.commit()
    delete_cache_by_pattern(f"notifications:{current_user.id}:*")
    db.refresh(notification)
    return notification
