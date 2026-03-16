
import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.cultural_site import CulturalSite
from app.models.site_follow import SiteFollow
from app.models.user import User, UserRole
from app.utils.exceptions import ForbiddenException, NotFoundException


def follow_site(db: Session, current_user: User, site_id: uuid.UUID) -> dict:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can follow cultural sites.")

    site = db.scalar(
        select(CulturalSite).where(
            CulturalSite.id == site_id,
            CulturalSite.is_active.is_(True),
        )
    )
    if not site:
        raise NotFoundException("Cultural site not found.")

    existing = db.scalar(
        select(SiteFollow).where(
            SiteFollow.user_id == current_user.id,
            SiteFollow.site_id == site_id,
        )
    )
    if not existing:
        db.add(SiteFollow(user_id=current_user.id, site_id=site_id))
        db.commit()

    count = db.scalar(
        select(func.count(SiteFollow.id)).where(SiteFollow.site_id == site_id)
    ) or 0

    return {
        "site_id": str(site_id),
        "followers_count": int(count),
        "following": True,
    }


def unfollow_site(db: Session, current_user: User, site_id: uuid.UUID) -> dict:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can unfollow cultural sites.")

    follow = db.scalar(
        select(SiteFollow).where(
            SiteFollow.user_id == current_user.id,
            SiteFollow.site_id == site_id,
        )
    )
    if follow:
        db.delete(follow)
        db.commit()

    count = db.scalar(
        select(func.count(SiteFollow.id)).where(SiteFollow.site_id == site_id)
    ) or 0

    return {
        "site_id": str(site_id),
        "followers_count": int(count),
        "following": False,
    }