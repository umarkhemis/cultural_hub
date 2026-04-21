
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.experiences.views_schema import ExperienceViewCreateRequest
from app.modules.experiences.views_service import (
    get_provider_experience_analytics,
    track_experience_view,
)
from app.modules.users.optional_auth import get_optional_current_user
from app.utils.responses import success_response

router = APIRouter(tags=["Experience Views"])


@router.post("/experience-views", status_code=status.HTTP_201_CREATED)
def create_experience_view(
    payload: ExperienceViewCreateRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    result = track_experience_view(db=db, payload=payload, current_user=current_user)
    return success_response(
        message="Experience view tracked successfully.",
        data=result,
    )


@router.get("/providers/me/experiences/{experience_id}/analytics")
def provider_experience_analytics(
    experience_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    if not current_user.cultural_site:
        return success_response(
            message="Provider analytics retrieved successfully.",
            data={
                "experience_id": experience_id,
                "total_views": 0,
                "unique_logged_in_viewers": 0,
                "anonymous_views": 0,
                "average_watch_seconds": 0,
                "completion_count": 0,
                "recent_viewers": [],
            },
        )

    result = get_provider_experience_analytics(
        db=db,
        experience_id=experience_id,
        provider_site_id=current_user.cultural_site.id,
    )
    return success_response(
        message="Provider analytics retrieved successfully.",
        data=result,
    )