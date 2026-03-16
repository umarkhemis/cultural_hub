
import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.experiences.schema import (
    CommentCreateRequest,
    ExperienceCreateRequest,
    ExperienceUpdateRequest,
)
from app.modules.experiences.service import (
    create_comment,
    create_experience,
    delete_experience,
    get_experience_detail,
    get_public_feed,
    like_experience,
    list_comments,
    unlike_experience,
    update_experience,
)
from app.modules.users.optional_auth import get_optional_current_user
from app.utils.responses import success_response
from app.modules.experiences.service import list_provider_experiences
from app.modules.experiences import serializer_experience

router = APIRouter(prefix="/experiences", tags=["Experiences"])


@router.get("/public-feed")
def public_feed(
    cursor: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    result = get_public_feed(
        db=db,
        current_user=current_user,
        cursor=cursor,
        limit=limit,
    )
    return success_response(
        message="Experiences retrieved successfully.",
        data=result,
    )


@router.get("/providers/me/experiences")
def my_experiences(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    experiences = list_provider_experiences(db=db, current_user=current_user)
    return success_response(
        message="Provider experiences retrieved successfully.",
        data={"items": [serializer_experience(experience, current_user=None) for experience in experiences]},
    )


@router.get("/{experience_id}")
def experience_detail(
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    result = get_experience_detail(
        db=db,
        experience_id=experience.id,
        current_user=current_user,
        include_non_published_for_owner=True,
    )
    return success_response(
        message="Experience retrieved successfully.",
        data=result,
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def create_experience_endpoint(
    payload: ExperienceCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    experience = create_experience(db=db, current_user=current_user, payload=payload)
    result = get_experience_detail(
        db=db,
        experience_id=experience.id,
        current_user=current_user,
        include_non_published_for_owner=True,        
    )
    return success_response(
        message="Experience created successfully.",
        data=result,
    )


@router.patch("/{experience_id}")
def update_experience_endpoint(
    experience_id: uuid.UUID,
    payload: ExperienceUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    experience = update_experience(
        db=db,
        current_user=current_user,
        experience_id=experience_id,
        payload=payload,
    )
    result = get_experience_detail(db=db, experience_id=experience.id, current_user=None)
    return success_response(
        message="Experience updated successfully.",
        data=result,
    )


@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_experience_endpoint(
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    delete_experience(db=db, current_user=current_user, experience_id=experience_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{experience_id}/like")
def like_experience_endpoint(
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    like_experience(db=db, current_user=current_user, experience_id=experience_id)
    return success_response(
        message="Experience liked successfully.",
        data={"experience_id": str(experience_id)},
    )


@router.delete("/{experience_id}/like")
def unlike_experience_endpoint(
    experience_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    unlike_experience(db=db, current_user=current_user, experience_id=experience_id)
    return success_response(
        message="Experience unliked successfully.",
        data={"experience_id": str(experience_id)},
    )


@router.post("/{experience_id}/comments", status_code=status.HTTP_201_CREATED)
def create_comment_endpoint(
    experience_id: uuid.UUID,
    payload: CommentCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.tourist)),
):
    comment = create_comment(
        db=db,
        current_user=current_user,
        experience_id=experience_id,
        payload=payload,
    )
    comments = list_comments(db=db, experience_id=experience_id, limit=1)
    return success_response(
        message="Comment added successfully.",
        data=comments[0] if comments else {"id": str(comment.id)},
    )


@router.get("/{experience_id}/comments")
def list_comments_endpoint(
    experience_id: uuid.UUID,
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    results = list_comments(db=db, experience_id=experience_id, limit=limit)
    return success_response(
        message="Comments retrieved successfully.",
        data={"items": results},
    )
