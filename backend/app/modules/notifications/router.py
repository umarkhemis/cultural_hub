
import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.modules.notifications.serializers import serialize_notification
from app.modules.notifications.service import list_user_notifications, mark_notification_as_read
from app.modules.users.service import get_current_user
from app.utils.responses import success_response

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def list_notifications_endpoint(
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notifications = list_user_notifications(db=db, current_user=current_user, limit=limit)

    items = [
        item if isinstance(item, dict) else serialize_notification(item)
        for item in notifications
    ]

    return success_response(
        message="Notifications retrieved successfully.",
        data={"items": items},
    )


@router.patch("/{notification_id}/read")
def mark_notification_read_endpoint(
    notification_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    notification = mark_notification_as_read(
        db=db,
        current_user=current_user,
        notification_id=notification_id,
    )
    return success_response(
        message="Notification marked as read.",
        data=serialize_notification(notification),
    )





