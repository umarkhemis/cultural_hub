
import uuid

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.packages.schema import PackageCreateRequest, PackageUpdateRequest
from app.modules.packages.serializers import serialize_package
from app.modules.packages.service import (
    archive_package,
    create_package,
    get_public_package_detail,
    list_provider_packages,
    list_public_packages,
    update_package,
)
from app.utils.responses import success_response
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.models.package import Package

router = APIRouter(tags=["Packages"])


@router.get("/packages")
def list_packages(
    provider_id: uuid.UUID | None = Query(default=None),
    upcoming_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    packages = list_public_packages(
        db=db,
        provider_id=provider_id,
        upcoming_only=upcoming_only,
    )
    return success_response(
        message="Packages retrieved successfully.",
        data={"items": [serialize_package(package) for package in packages]},
    )


@router.get("/packages/{package_id}")
def get_package_detail(
    package_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    package = get_public_package_detail(db=db, package_id=package_id)
    return success_response(
        message="Package retrieved successfully.",
        data=serialize_package(package),
    )


@router.get("/providers/me/packages")
def list_my_packages(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    packages = list_provider_packages(db=db, current_user=current_user)
    return success_response(
        message="Provider packages retrieved successfully.",
        data={"items": [serialize_package(package) for package in packages]},
    )


@router.post("/packages", status_code=status.HTTP_201_CREATED)
def create_package_endpoint(
    payload: PackageCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    package = create_package(db=db, current_user=current_user, payload=payload)
    package = db.scalar(
        select(Package)
        .options(
            joinedload(Package.provider),
            joinedload(Package.media_items),
        )
        .where(Package.id == package.id)
    )
    return success_response(
        message="Package created successfully.",
        data=serialize_package(package),
    )


@router.patch("/packages/{package_id}")
def update_package_endpoint(
    package_id: uuid.UUID,
    payload: PackageUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    package = update_package(
        db=db,
        current_user=current_user,
        package_id=package_id,
        payload=payload,
    )
    package = db.scalar(
        select(Package)
        .options(
            joinedload(Package.provider),
            joinedload(Package.media_items),
        )
        .where(Package.id == package.id)
    )
    return success_response(
        message="Package updated successfully.",
        data=serialize_package(package),
    )


@router.delete("/packages/{package_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_package_endpoint(
    package_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    archive_package(db=db, current_user=current_user, package_id=package_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)