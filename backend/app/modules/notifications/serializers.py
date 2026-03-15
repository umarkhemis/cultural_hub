
from app.models.notification import Notification


def serialize_notification(notification: Notification) -> dict:
    return {
        "id": str(notification.id),
        "notification_type": notification.notification_type.value,
        "title": notification.title,
        "message": notification.message,
        "related_entity_id": notification.related_entity_id,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
    }
