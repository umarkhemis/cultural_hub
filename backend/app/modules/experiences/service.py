
import uuid
from base64 import b64decode, b64encode
from datetime import datetime, timezone

from sqlalchemy import and_, desc, func, or_, select
from sqlalchemy.orm import Session, joinedload
from app.cache.keys import public_feed_key
from app.cache.redis import get_cache, set_cache, delete_cache_by_pattern
from app.core.config import settings

from app.models.cultural_site import CulturalSite
from app.models.experience import Experience, ExperienceStatus
from app.models.experience_comment import ExperienceComment
from app.models.experience_like import ExperienceLike
from app.models.site_follow import SiteFollow 
from app.models.experience_media import ExperienceMedia, MediaType
from app.models.user import User, UserRole
from app.modules.experiences.schema import (
    CommentCreateRequest,
    ExperienceCreateRequest,
    ExperienceUpdateRequest,
)
from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException



def encode_cursor(created_at: datetime, experience_id: uuid.UUID) -> str:
    raw = f"{created_at.isoformat()}|{experience_id}"
    return b64encode(raw.encode("utf-8")).decode("utf-8")


def decode_cursor(cursor: str) -> tuple[datetime, uuid.UUID]:
    try:
        raw = b64decode(cursor.encode("utf-8")).decode("utf-8")
        created_at_str, experience_id_str = raw.split("|", 1)
        return datetime.fromisoformat(created_at_str), uuid.UUID(experience_id_str)
    except Exception as exc:
        raise ValidationException("Invalid cursor.") from exc


def _get_provider_site_for_user(db: Session, user: User) -> CulturalSite:
    site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == user.id))
    if not site:
        raise ForbiddenException("Provider profile not found.")
    return site


def list_provider_experiences(db: Session, current_user: User) -> list[Experience]:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can view their experiences.")

    provider_site = _get_provider_site_for_user(db, current_user)

    experiences = db.scalars(
        select(Experience)
        .options(
            joinedload(Experience.provider),
            joinedload(Experience.media_items),
        )
        .where(Experience.provider_id == provider_site.id)
        .order_by(desc(Experience.created_at))
    ).unique().all()

    return list(experiences)




def create_experience(db: Session, current_user: User, payload: ExperienceCreateRequest) -> Experience:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can create experiences.")

    provider_site = _get_provider_site_for_user(db, current_user)

    experience = Experience(
        provider_id=provider_site.id,
        caption=payload.caption.strip(),
        location=payload.location,
        status=ExperienceStatus.published,
    )
    db.add(experience)
    db.flush()

    for item in payload.media_items:
        media = ExperienceMedia(
            experience_id=experience.id,
            media_url=item.media_url,
            media_type=MediaType(item.media_type),
            thumbnail_url=item.thumbnail_url,
            media_order=item.media_order,
        )
        db.add(media)

    db.commit()
    delete_cache_by_pattern("feed:public:*")
    db.refresh(experience)
    return experience


def update_experience(
    db: Session,
    current_user: User,
    experience_id: uuid.UUID,
    payload: ExperienceUpdateRequest,
) -> Experience:
    experience = db.scalar(
        select(Experience)
        .options(joinedload(Experience.media_items))
        .where(Experience.id == experience_id)
    )
    if not experience:
        raise NotFoundException("Experience not found.")

    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can update experiences.")

    provider_site = _get_provider_site_for_user(db, current_user)
    if experience.provider_id != provider_site.id:
        raise ForbiddenException("You can only update your own experiences.")

    if payload.caption is not None:
        experience.caption = payload.caption.strip()

    if payload.location is not None:
        experience.location = payload.location

    if payload.status is not None:
        experience.status = ExperienceStatus(payload.status)

    if payload.media_items is not None:
        for media in list(experience.media_items):
            db.delete(media)
        db.flush()

        for item in payload.media_items:
            db.add(
                ExperienceMedia(
                    experience_id=experience.id,
                    media_url=item.media_url,
                    media_type=MediaType(item.media_type),
                    thumbnail_url=item.thumbnail_url,
                    media_order=item.media_order,
                )
            )

    db.commit()
    delete_cache_by_pattern("feed:public:*")
    db.refresh(experience)
    return experience


def delete_experience(db: Session, current_user: User, experience_id: uuid.UUID) -> None:
    experience = db.scalar(select(Experience).where(Experience.id == experience_id))
    if not experience:
        raise NotFoundException("Experience not found.")

    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can delete experiences.")

    provider_site = _get_provider_site_for_user(db, current_user)
    if experience.provider_id != provider_site.id:
        raise ForbiddenException("You can only delete your own experiences.")

    experience.status = ExperienceStatus.archived
    db.commit()
    delete_cache_by_pattern("feed:public:*")





# def get_public_feed(
#     db: Session,
#     current_user: User | None = None,
#     cursor: str | None = None,
#     limit: int = 20,
# ) -> dict:
#     limit = min(max(limit, 1), 50)

#     should_use_cache = current_user is None
#     cache_key = public_feed_key(cursor=cursor, limit=limit)

#     if should_use_cache:
#         cached = get_cache(cache_key)
#         if cached is not None:
#             return cached

#     likes_subq = (
#         select(
#             ExperienceLike.experience_id,
#             func.count(ExperienceLike.id).label("likes_count"),
#         )
#         .group_by(ExperienceLike.experience_id)
#         .subquery()
#     )

#     comments_subq = (
#         select(
#             ExperienceComment.experience_id,
#             func.count(ExperienceComment.id).label("comments_count"),
#         )
#         .group_by(ExperienceComment.experience_id)
#         .subquery()
#     )

#     query = (
#         select(
#             Experience,
#             CulturalSite,
#             func.coalesce(likes_subq.c.likes_count, 0).label("likes_count"),
#             func.coalesce(comments_subq.c.comments_count, 0).label("comments_count"),
#         )
#         .join(CulturalSite, Experience.provider_id == CulturalSite.id)
#         .outerjoin(likes_subq, Experience.id == likes_subq.c.experience_id)
#         .outerjoin(comments_subq, Experience.id == comments_subq.c.experience_id)
#         .options(joinedload(Experience.media_items))
#         .where(Experience.status == ExperienceStatus.published)
#         .order_by(desc(Experience.created_at), desc(Experience.id))
#         .limit(limit + 1)
#     )

#     if cursor:
#         cursor_created_at, cursor_id = decode_cursor(cursor)
#         query = query.where(
#             or_(
#                 Experience.created_at < cursor_created_at,
#                 and_(
#                     Experience.created_at == cursor_created_at,
#                     Experience.id < cursor_id,
#                 ),
#             )
#         )

#     rows = db.execute(query).unique().all()

#     has_more = len(rows) > limit
#     rows = rows[:limit]

#     current_user_likes = set()
#     if current_user and current_user.role == UserRole.tourist and rows:
#         experience_ids = [row[0].id for row in rows]
#         liked_rows = db.execute(
#             select(ExperienceLike.experience_id).where(
#                 ExperienceLike.user_id == current_user.id,
#                 ExperienceLike.experience_id.in_(experience_ids),
#             )
#         ).all()
#         current_user_likes = {row[0] for row in liked_rows}

#     items = []
#     for experience, site, likes_count, comments_count in rows:
#         items.append(
#             {
#                 "id": str(experience.id),
#                 "caption": experience.caption,
#                 "location": experience.location,
#                 "status": experience.status.value,
#                 "created_at": experience.created_at,
#                 "updated_at": experience.updated_at,
#                 "provider": {
#                     "id": str(site.id),
#                     "site_name": site.site_name,
#                     "logo_url": site.logo_url,
#                     "location": site.location,
#                 },
#                 "media_items": [
#                     {
#                         "id": str(media.id),
#                         "media_url": media.media_url,
#                         "media_type": media.media_type.value,
#                         "thumbnail_url": media.thumbnail_url,
#                         "media_order": media.media_order,
#                     }
#                     for media in experience.media_items
#                 ],
#                 "likes_count": int(likes_count or 0),
#                 "comments_count": int(comments_count or 0),
#                 "liked_by_current_user": experience.id in current_user_likes,
#             }
#         )

#     next_cursor = None
#     if has_more and rows:
#         last_experience = rows[-1][0]
#         next_cursor = encode_cursor(last_experience.created_at, last_experience.id)

#     result = {
#         "items": items,
#         "next_cursor": next_cursor,
#     }

#     if should_use_cache:
#         set_cache(
#             cache_key,
#             result,
#             ttl_seconds=settings.FEED_CACHE_TTL_SECONDS,
#         )

#     return result






def get_public_feed(
    db: Session,
    current_user: User | None = None,
    cursor: str | None = None,
    limit: int = 20,
) -> dict:
    limit = min(max(limit, 1), 50)

    should_use_cache = current_user is None
    cache_key = public_feed_key(cursor=cursor, limit=limit)

    if should_use_cache:
        cached = get_cache(cache_key)
        if cached is not None:
            return cached

    likes_subq = (
        select(ExperienceLike.experience_id, func.count(ExperienceLike.id).label("likes_count"))
        .group_by(ExperienceLike.experience_id)
        .subquery()
    )
    comments_subq = (
        select(ExperienceComment.experience_id, func.count(ExperienceComment.id).label("comments_count"))
        .group_by(ExperienceComment.experience_id)
        .subquery()
    )
    followers_subq = (
        select(SiteFollow.site_id, func.count(SiteFollow.id).label("followers_count"))
        .group_by(SiteFollow.site_id)
        .subquery()
    )

    query = (
        select(
            Experience,
            CulturalSite,
            func.coalesce(likes_subq.c.likes_count, 0).label("likes_count"),
            func.coalesce(comments_subq.c.comments_count, 0).label("comments_count"),
            func.coalesce(followers_subq.c.followers_count, 0).label("followers_count"),
        )
        .join(CulturalSite, Experience.provider_id == CulturalSite.id)
        .outerjoin(likes_subq, Experience.id == likes_subq.c.experience_id)
        .outerjoin(comments_subq, Experience.id == comments_subq.c.experience_id)
        .outerjoin(followers_subq, CulturalSite.id == followers_subq.c.site_id)
        .options(joinedload(Experience.media_items))
        .where(Experience.status == ExperienceStatus.published)
        .order_by(desc(Experience.created_at), desc(Experience.id))
        .limit(limit + 1)
    )

    if cursor:
        cursor_created_at, cursor_id = decode_cursor(cursor)
        query = query.where(
            or_(
                Experience.created_at < cursor_created_at,
                and_(Experience.created_at == cursor_created_at, Experience.id < cursor_id),
            )
        )

    rows = db.execute(query).unique().all()
    has_more = len(rows) > limit
    rows = rows[:limit]

    current_user_likes: set = set()
    current_user_follows: set = set()

    if current_user and current_user.role == UserRole.tourist and rows:
        experience_ids = [row[0].id for row in rows]
        site_ids = [row[1].id for row in rows]

        liked_rows = db.execute(
            select(ExperienceLike.experience_id).where(
                ExperienceLike.user_id == current_user.id,
                ExperienceLike.experience_id.in_(experience_ids),
            )
        ).all()
        current_user_likes = {row[0] for row in liked_rows}

        followed_rows = db.execute(
            select(SiteFollow.site_id).where(
                SiteFollow.user_id == current_user.id,
                SiteFollow.site_id.in_(site_ids),
            )
        ).all()
        current_user_follows = {row[0] for row in followed_rows}

    items = []
    for experience, site, likes_count, comments_count, followers_count in rows:
        items.append({
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
                "followers_count": int(followers_count or 0),
                "following": site.id in current_user_follows,
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
            "liked_by_current_user": experience.id in current_user_likes,
        })

    next_cursor = None
    if has_more and rows:
        last_experience = rows[-1][0]
        next_cursor = encode_cursor(last_experience.created_at, last_experience.id)

    result = {"items": items, "next_cursor": next_cursor}

    if should_use_cache:
        set_cache(cache_key, result, ttl_seconds=settings.FEED_CACHE_TTL_SECONDS)

    return result







def get_experience_detail(
    db: Session,
    experience_id: uuid.UUID,
    current_user: User | None = None,
    include_non_published_for_owner: bool = False,
) -> dict:
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

    conditions = [Experience.id == experience_id]

    if not include_non_published_for_owner:
        conditions.append(Experience.status == ExperienceStatus.published)

    row = db.execute(
        select(
            Experience,
            CulturalSite,
            func.coalesce(likes_subq.c.likes_count, 0).label("likes_count"),
            func.coalesce(comments_subq.c.comments_count, 0).label("comments_count"),
        )
        .join(CulturalSite, Experience.provider_id == CulturalSite.id)
        .outerjoin(likes_subq, Experience.id == likes_subq.c.experience_id)
        .outerjoin(comments_subq, Experience.id == comments_subq.c.experience_id)
        .options(joinedload(Experience.media_items))
        .where(*conditions)
    ).unique().first()

    if not row:
        raise NotFoundException("Experience not found.")

    experience, site, likes_count, comments_count = row

    if include_non_published_for_owner and experience.status != ExperienceStatus.published:
        if not current_user or current_user.role != UserRole.provider:
            raise NotFoundException("Experience not found.")
        owner_site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == current_user.id))
        if not owner_site or owner_site.id != experience.provider_id:
            raise NotFoundException("Experience not found.")

    liked_by_current_user = False
    if current_user and current_user.role == UserRole.tourist:
        existing_like = db.scalar(
            select(ExperienceLike).where(
                ExperienceLike.user_id == current_user.id,
                ExperienceLike.experience_id == experience.id,
            )
        )
        liked_by_current_user = existing_like is not None

    return {
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
        "liked_by_current_user": liked_by_current_user,
    }



def like_experience(db: Session, current_user: User, experience_id: uuid.UUID) -> None:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can like experiences.")

    experience = db.scalar(
        select(Experience).where(
            Experience.id == experience_id,
            Experience.status == ExperienceStatus.published,
        )
    )
    if not experience:
        raise NotFoundException("Experience not found.")

    existing_like = db.scalar(
        select(ExperienceLike).where(
            ExperienceLike.user_id == current_user.id,
            ExperienceLike.experience_id == experience_id,
        )
    )
    if existing_like:
        return

    like = ExperienceLike(
        user_id=current_user.id,
        experience_id=experience_id,
    )
    db.add(like)
    db.commit()


def unlike_experience(db: Session, current_user: User, experience_id: uuid.UUID) -> None:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can unlike experiences.")

    existing_like = db.scalar(
        select(ExperienceLike).where(
            ExperienceLike.user_id == current_user.id,
            ExperienceLike.experience_id == experience_id,
        )
    )
    if not existing_like:
        return

    db.delete(existing_like)
    db.commit()


def create_comment(
    db: Session,
    current_user: User,
    experience_id: uuid.UUID,
    payload: CommentCreateRequest,
) -> ExperienceComment:
    if current_user.role != UserRole.tourist:
        raise ForbiddenException("Only tourists can comment on experiences.")

    experience = db.scalar(
        select(Experience).where(
            Experience.id == experience_id,
            Experience.status == ExperienceStatus.published,
        )
    )
    if not experience:
        raise NotFoundException("Experience not found.")

    comment = ExperienceComment(
        user_id=current_user.id,
        experience_id=experience_id,
        comment_text=payload.comment_text.strip(),
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def list_comments(db: Session, experience_id: uuid.UUID, limit: int = 20) -> list[dict]:
    limit = min(max(limit, 1), 100)

    experience = db.scalar(
        select(Experience).where(
            Experience.id == experience_id,
            Experience.status == ExperienceStatus.published,
        )
    )
    if not experience:
        raise NotFoundException("Experience not found.")

    rows = db.execute(
        select(
            ExperienceComment,
            User,
        )
        .join(User, ExperienceComment.user_id == User.id)
        .where(ExperienceComment.experience_id == experience_id)
        .order_by(desc(ExperienceComment.created_at))
        .limit(limit)
    ).all()

    results = []
    for comment, user in rows:
        results.append(
            {
                "id": str(comment.id),
                "comment_text": comment.comment_text,
                "created_at": comment.created_at,
                "author": {
                    "id": str(user.id),
                    "full_name": user.full_name,
                    "profile_image_url": user.profile_image_url,
                },
            }
        )
    return results
