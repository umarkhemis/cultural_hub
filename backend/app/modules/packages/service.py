
import uuid

from sqlalchemy import desc, select
from sqlalchemy.orm import Session, joinedload

from app.models.cultural_site import CulturalSite
from app.models.package import Package, PackageStatus
from app.models.package_media import PackageMedia
from app.models.user import User, UserRole
from app.modules.packages.schema import PackageCreateRequest, PackageUpdateRequest
from app.utils.exceptions import ForbiddenException, NotFoundException, ValidationException


def _get_provider_site_for_user(db: Session, user: User) -> CulturalSite:
    site = db.scalar(select(CulturalSite).where(CulturalSite.user_id == user.id))
    if not site:
        raise ForbiddenException("Provider profile not found.")
    return site


def create_package(db: Session, current_user: User, payload: PackageCreateRequest) -> Package:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can create packages.")

    provider_site = _get_provider_site_for_user(db, current_user)

    package = Package(
        provider_id=provider_site.id,
        package_name=payload.package_name,
        description=payload.description,
        price=payload.price,
        duration=payload.duration,
        event_date=payload.event_date,
        includes_text=payload.includes_text,
        status=PackageStatus.published,
    )
    db.add(package)
    db.flush()

    for item in payload.media_items:
        db.add(
            PackageMedia(
                package_id=package.id,
                media_url=item.media_url,
                thumbnail_url=item.thumbnail_url,
                media_order=item.media_order,
            )
        )

    db.commit()
    db.refresh(package)
    return package


def list_public_packages(
    db: Session,
    provider_id: uuid.UUID | None = None,
    status: PackageStatus = PackageStatus.published,
    upcoming_only: bool = False,
) -> list[Package]:
    query = (
        select(Package)
        .options(
            joinedload(Package.provider),
            joinedload(Package.media_items),
        )
        .where(Package.status == status)
        .order_by(desc(Package.created_at))
    )

    if provider_id:
        query = query.where(Package.provider_id == provider_id)

    if upcoming_only:
        from datetime import datetime, timezone
        query = query.where(Package.event_date >= datetime.now(timezone.utc))

    return list(db.scalars(query).unique().all())


def get_public_package_detail(db: Session, package_id: uuid.UUID) -> Package:
    package = db.scalar(
        select(Package)
        .options(
            joinedload(Package.provider),
            joinedload(Package.media_items),
        )
        .where(
            Package.id == package_id,
            Package.status == PackageStatus.published,
        )
    )
    if not package:
        raise NotFoundException("Package not found.")
    return package


def list_provider_packages(db: Session, current_user: User) -> list[Package]:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can view their packages.")

    provider_site = _get_provider_site_for_user(db, current_user)

    packages = db.scalars(
        select(Package)
        .options(
            joinedload(Package.provider),
            joinedload(Package.media_items),
        )
        .where(Package.provider_id == provider_site.id)
        .order_by(desc(Package.created_at))
    ).unique().all()

    return list(packages)


def update_package(
    db: Session,
    current_user: User,
    package_id: uuid.UUID,
    payload: PackageUpdateRequest,
) -> Package:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can update packages.")

    provider_site = _get_provider_site_for_user(db, current_user)

    package = db.scalar(
        select(Package)
        .options(
            joinedload(Package.provider),
            joinedload(Package.media_items),
        )
        .where(Package.id == package_id)
    )
    if not package:
        raise NotFoundException("Package not found.")

    if package.provider_id != provider_site.id:
        raise ForbiddenException("You can only update your own packages.")

    if payload.package_name is not None:
        package.package_name = payload.package_name.strip()
    if payload.description is not None:
        package.description = payload.description.strip()
    if payload.price is not None:
        package.price = payload.price
    if payload.duration is not None:
        package.duration = payload.duration
    if payload.includes_text is not None:
        package.includes_text = payload.includes_text
    if payload.event_date is not None:
        package.event_date = payload.event_date
    if payload.status is not None:
        try:
            package.status = PackageStatus(payload.status)
        except ValueError as exc:
            raise ValidationException("Invalid package status.") from exc

    if payload.media_items is not None:
        for media in list(package.media_items):
            db.delete(media)
        db.flush()

        for item in payload.media_items:
            db.add(
                PackageMedia(
                    package_id=package.id,
                    media_url=item.media_url,
                    thumbnail_url=item.thumbnail_url,
                    media_order=item.media_order,
                )
            )

    db.commit()
    db.refresh(package)
    return package


def archive_package(db: Session, current_user: User, package_id: uuid.UUID) -> None:
    if current_user.role != UserRole.provider:
        raise ForbiddenException("Only providers can delete packages.")

    provider_site = _get_provider_site_for_user(db, current_user)

    package = db.scalar(select(Package).where(Package.id == package_id))
    if not package:
        raise NotFoundException("Package not found.")

    if package.provider_id != provider_site.id:
        raise ForbiddenException("You can only delete your own packages.")

    package.status = PackageStatus.archived
    db.commit()