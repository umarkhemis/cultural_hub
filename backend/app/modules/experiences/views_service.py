
from datetime import datetime, timezone
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.experience import Experience
from app.models.experience_view import ExperienceView
from app.models.user import User
from app.utils.exceptions import NotFoundException


def track_experience_view(db: Session, payload, current_user: User | None = None):
    experience = db.get(Experience, payload.experience_id)
    if not experience:
        raise NotFoundException("Experience not found.")

    view = ExperienceView(
        experience_id=experience.id,
        viewer_user_id=current_user.id if current_user else None,
        session_id=payload.session_id,
        viewed_at=datetime.now(timezone.utc),
        watch_seconds=payload.watch_seconds,
        completed=payload.completed,
    )
    db.add(view)
    db.commit()
    db.refresh(view)

    return {"id": str(view.id)}


def get_provider_experience_analytics(db: Session, experience_id, provider_site_id):
    experience = db.get(Experience, experience_id)
    if not experience:
        raise NotFoundException("Experience not found.")

    if experience.provider_id != provider_site_id:
        raise NotFoundException("Experience not found.")

    total_views = db.scalar(
        select(func.count(ExperienceView.id)).where(
            ExperienceView.experience_id == experience.id
        )
    ) or 0

    unique_logged_in_viewers = db.scalar(
        select(func.count(func.distinct(ExperienceView.viewer_user_id))).where(
            ExperienceView.experience_id == experience.id,
            ExperienceView.viewer_user_id.isnot(None),
        )
    ) or 0

    anonymous_views = db.scalar(
        select(func.count(ExperienceView.id)).where(
            ExperienceView.experience_id == experience.id,
            ExperienceView.viewer_user_id.is_(None),
        )
    ) or 0

    average_watch_seconds = db.scalar(
        select(func.avg(ExperienceView.watch_seconds)).where(
            ExperienceView.experience_id == experience.id
        )
    ) or 0

    completion_count = db.scalar(
        select(func.count(ExperienceView.id)).where(
            ExperienceView.experience_id == experience.id,
            ExperienceView.completed.is_(True),
        )
    ) or 0

    recent_views = db.scalars(
        select(ExperienceView)
        .where(ExperienceView.experience_id == experience.id)
        .order_by(ExperienceView.viewed_at.desc())
        .limit(20)
    ).all()

    recent_viewers = []
    for item in recent_views:
        recent_viewers.append(
            {
                "viewer_user_id": str(item.viewer_user_id) if item.viewer_user_id else None,
                "session_id": item.session_id,
                "viewed_at": item.viewed_at,
                "watch_seconds": item.watch_seconds,
                "completed": item.completed,
            }
        )

    return {
        "experience_id": str(experience.id),
        "total_views": int(total_views),
        "unique_logged_in_viewers": int(unique_logged_in_viewers),
        "anonymous_views": int(anonymous_views),
        "average_watch_seconds": float(average_watch_seconds or 0),
        "completion_count": int(completion_count),
        "recent_viewers": recent_viewers,
    }