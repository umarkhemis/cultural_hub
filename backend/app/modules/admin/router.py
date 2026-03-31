
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.admin.service import (
    get_admin_overview,
    list_admin_bookings,
    list_admin_experiences,
    list_admin_packages,
    # list_admin_reports,
    list_admin_sites,
    list_admin_users,
)
from app.utils.responses import success_response

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/overview")
def admin_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    return success_response(
        message="Admin overview retrieved successfully.",
        data=get_admin_overview(db=db),
    )


@router.get("/users")
def admin_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    return success_response(
        message="Users retrieved successfully.",
        data={"items": list_admin_users(db=db)},
    )


@router.get("/sites")
def admin_sites(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    return success_response(
        message="Sites retrieved successfully.",
        data={"items": list_admin_sites(db=db)},
    )


@router.get("/bookings")
def admin_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    return success_response(
        message="Bookings retrieved successfully.",
        data={"items": list_admin_bookings(db=db)},
    )


@router.get("/experiences")
def admin_experiences(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    return success_response(
        message="Experiences retrieved successfully.",
        data={"items": list_admin_experiences(db=db)},
    )


@router.get("/packages")
def admin_packages(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    return success_response(
        message="Packages retrieved successfully.",
        data={"items": list_admin_packages(db=db)},
    )


# @router.get("/reports")
# def admin_reports(
#     db: Session = Depends(get_db),
#     current_user: User = Depends(require_roles(UserRole.admin)),
# ):
#     return success_response(
#         message="Reports retrieved successfully.",
#         data={"items": list_admin_reports(db=db)},
#     )