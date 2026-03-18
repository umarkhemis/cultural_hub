
import uuid

from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session, joinedload

from app.models.cultural_site import CulturalSite
from app.models.experience import Experience, ExperienceStatus
from app.models.experience_comment import ExperienceComment
from app.models.experience_like import ExperienceLike
from app.models.package import Package, PackageStatus
from app.utils.exceptions import NotFoundException
from app.models.site_follow import SiteFollow
# from app.models.user import User
from app.models.user import User, UserRole
from app.utils.exceptions import ForbiddenException
from app.modules.sites.schema import SiteUpdateRequest


def list_public_sites(db: Session, current_user: User | None = None) -> list[dict]:
    experience_count_subq = (
        select(
            Experience.provider_id,
            func.count(Experience.id).label("experiences_count"),
        )
        .where(Experience.status == ExperienceStatus.published)
        .group_by(Experience.provider_id)
        .subquery()
    )

    package_count_subq = (
        select(
            Package.provider_id,
            func.count(Package.id).label("packages_count"),
        )
        .where(Package.status == PackageStatus.published)
        .group_by(Package.provider_id)
        .subquery()
    )

    follower_count_subq = (
        select(
            SiteFollow.site_id,
            func.count(SiteFollow.id).label("followers_count"),
        )
        .group_by(SiteFollow.site_id)
        .subquery()
    )

    rows = db.execute(
        select(
            CulturalSite,
            func.coalesce(experience_count_subq.c.experiences_count, 0).label("experiences_count"),
            func.coalesce(package_count_subq.c.packages_count, 0).label("packages_count"),
            func.coalesce(follower_count_subq.c.followers_count, 0).label("followers_count"),
        )
        .outerjoin(
            experience_count_subq,
            CulturalSite.id == experience_count_subq.c.provider_id,
        )
        .outerjoin(
            package_count_subq,
            CulturalSite.id == package_count_subq.c.provider_id,
        )
        .outerjoin(
            follower_count_subq,
            CulturalSite.id == follower_count_subq.c.site_id,
        )
        .where(CulturalSite.is_active.is_(True))
        .order_by(desc(CulturalSite.created_at))
    ).all()

    current_user_site_follows = set()
    if current_user:
        followed_rows = db.execute(
            select(SiteFollow.site_id).where(SiteFollow.user_id == current_user.id)
        ).all()
        current_user_site_follows = {row[0] for row in followed_rows}

    items = []
    for site, experiences_count, packages_count, followers_count in rows:
        items.append(
            {
                "id": str(site.id),
                "site_name": site.site_name,
                "description": site.description,
                "location": site.location,
                "logo_url": site.logo_url,
                "contact_email": site.contact_email,
                "contact_phone": site.contact_phone,
                "verification_status": site.verification_status.value,
                "experiences_count": int(experiences_count or 0),
                "packages_count": int(packages_count or 0),
                "followers_count": int(followers_count or 0),
                "following": site.id in current_user_site_follows,
                "created_at": site.created_at,
            }
        )

    return items


def get_public_site_detail(db: Session, site_id: uuid.UUID, current_user: User | None = None,) -> dict:
    site = db.scalar(
        select(CulturalSite).where(
            CulturalSite.id == site_id,
            CulturalSite.is_active.is_(True),
        )
    )
    if not site:
        raise NotFoundException("Cultural site not found.")

    likes_subq = (
        select(
            ExperienceLike.experience_id,
            func.count(ExperienceLike.id).label("likes_count"),
        )
        .group_by(ExperienceLike.experience_id)
        .subquery()
    )

    comments_subq = (
        select(
            ExperienceComment.experience_id,
            func.count(ExperienceComment.id).label("comments_count"),
        )
        .group_by(ExperienceComment.experience_id)
        .subquery()
    )

    experience_rows = db.execute(
        select(
            Experience,
            func.coalesce(likes_subq.c.likes_count, 0).label("likes_count"),
            func.coalesce(comments_subq.c.comments_count, 0).label("comments_count"),
        )
        .outerjoin(likes_subq, Experience.id == likes_subq.c.experience_id)
        .outerjoin(comments_subq, Experience.id == comments_subq.c.experience_id)
        .options(joinedload(Experience.media_items))
        .where(
            Experience.provider_id == site.id,
            Experience.status == ExperienceStatus.published,
        )
        .order_by(desc(Experience.created_at))
    ).unique().all()

    package_rows = db.scalars(
        select(Package)
        .options(joinedload(Package.media_items))
        .where(
            Package.provider_id == site.id,
            Package.status == PackageStatus.published,
        )
        .order_by(desc(Package.created_at))
    ).unique().all()

    experiences = []
    for experience, likes_count, comments_count in experience_rows:
        experiences.append(
            {
                "id": str(experience.id),
                "caption": experience.caption,
                "location": experience.location,
                "status": experience.status.value,
                "created_at": experience.created_at,
                "updated_at": experience.updated_at,
                "provider": {
                    "id": str(site.id),
                    "site_name": site.site_name,
                    "logo_url": site.logo_url,
                    "location": site.location,
                },
                "media_items": [
                    {
                        "id": str(media.id),
                        "media_url": media.media_url,
                        "media_type": media.media_type.value,
                        "thumbnail_url": media.thumbnail_url,
                        "media_order": media.media_order,
                    }
                    for media in experience.media_items
                ],
                "likes_count": int(likes_count or 0),
                "comments_count": int(comments_count or 0),
                "liked_by_current_user": False,
            }
        )

    packages = []
    for package in package_rows:
        packages.append(
            {
                "id": str(package.id),
                "package_name": package.package_name,
                "description": package.description,
                "price": float(package.price),
                "duration": package.duration,
                "event_date": package.event_date,
                "includes_text": package.includes_text,
                "status": package.status.value,
                "created_at": package.created_at,
                "updated_at": package.updated_at,
                "provider": {
                    "id": str(site.id),
                    "site_name": site.site_name,
                    "logo_url": site.logo_url,
                    "location": site.location,
                },
                "media_items": [
                    {
                        "id": str(media.id),
                        "media_url": media.media_url,
                        "thumbnail_url": media.thumbnail_url,
                        "media_order": media.media_order,
                    }
                    for media in package.media_items
                ],
            }
        )

    followers_count = db.scalar(
        select(func.count(SiteFollow.id)).where(SiteFollow.site_id == site.id)
    ) or 0

    following = False
    if current_user:
        following = db.scalar(
            select(SiteFollow.id).where(
                SiteFollow.user_id == current_user.id,
                SiteFollow.site_id == site.id,
            )
        ) is not None

    return {
        "id": str(site.id),
        "site_name": site.site_name,
        "description": site.description,
        "location": site.location,
        "logo_url": site.logo_url,
        "contact_email": site.contact_email,
        "contact_phone": site.contact_phone,
        "verification_status": site.verification_status.value,
        "created_at": site.created_at,
        "experiences": experiences,
        "packages": packages,
        "followers_count": int(followers_count),
        "following": following,
    }



def update_provider_site(db: Session, current_user: User, payload: SiteUpdateRequest) -> dict:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can update their cultural site.")

    site = db.scalar(
        select(CulturalSite).where(CulturalSite.user_id == current_user.id)
    )
    if not site:
        raise NotFoundException("Provider site not found.")

    if payload.site_name is not None:
        site.site_name = payload.site_name.strip()
    if payload.description is not None:
        site.description = payload.description.strip()
    if payload.location is not None:
        site.location = payload.location.strip()
    if payload.contact_email is not None:
        site.contact_email = payload.contact_email.lower()
    if payload.contact_phone is not None:
        site.contact_phone = payload.contact_phone.strip() or None
    if payload.logo_url is not None:
        site.logo_url = payload.logo_url

    db.commit()
    db.refresh(site)

    return {
        "id": str(site.id),
        "site_name": site.site_name,
        "description": site.description,
        "location": site.location,
        "logo_url": site.logo_url,
        "contact_email": site.contact_email,
        "contact_phone": site.contact_phone,
        "verification_status": site.verification_status.value,
        "created_at": site.created_at,
    }