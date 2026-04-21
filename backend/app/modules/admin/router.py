


from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.models.cultural_site import CulturalSite, VerificationStatus
from app.models.experience import Experience, ExperienceStatus
from app.models.package import Package, PackageStatus
from app.modules.admin.service import (
    get_admin_overview,
    list_admin_bookings,
    list_admin_experiences,
    list_admin_packages,
    list_admin_sites,
    list_admin_users,
)
from app.utils.responses import success_response

router = APIRouter(prefix="/admin", tags=["Admin"])


# ──────────────────────────────────────────────────────────
# Pydantic input schemas (validates request bodies)
# ──────────────────────────────────────────────────────────

class PatchUserBody(BaseModel):
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    # Never allow role escalation via this endpoint — handled separately

class PatchSiteBody(BaseModel):
    verification_status: Optional[str] = None   # "verified" | "unverified"

class PatchExperienceBody(BaseModel):
    status: Optional[str] = None                # "published" | "removed"

class PatchPackageBody(BaseModel):
    status: Optional[str] = None                # "published" | "unpublished"

class PatchReportBody(BaseModel):
    status: Optional[str] = None                # "resolved" | "dismissed"


# ──────────────────────────────────────────────────────────
# Audit log helper (write to DB or structured logs)
# ──────────────────────────────────────────────────────────

def audit_log(action: str, target_type: str, target_id: str, admin: User, detail: str = ""):
    """
    Write an audit record. In production, persist to an AuditLog table.
    For now, writes a structured log line so your log aggregator can pick it up.
    """
    import logging, json
    logging.getLogger("audit").info(json.dumps({
        "action":      action,
        "target_type": target_type,
        "target_id":   str(target_id),
        "admin_id":    str(admin.id),
        "admin_email": admin.email,
        "detail":      detail,
    }))


# ──────────────────────────────────────────────────────────
# READ endpoints (unchanged from original)
# ──────────────────────────────────────────────────────────

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


@router.get("/reports")
def admin_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    # Uncomment when Report model is ready:
    # from app.modules.admin.service import list_admin_reports
    # return success_response(message="Reports retrieved.", data={"items": list_admin_reports(db=db)})
    return success_response(message="Reports retrieved.", data={"items": []})


# ──────────────────────────────────────────────────────────
# PATCH /admin/users/{user_id}
# ──────────────────────────────────────────────────────────

@router.patch("/users/{user_id}")
def admin_patch_user(
    user_id: str,
    body: PatchUserBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Safety: admin cannot suspend themselves
    if str(user.id) == str(current_user.id) and body.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admins cannot suspend their own account.",
        )

    changes = []
    if body.is_active is not None:
        user.is_active = body.is_active
        changes.append(f"is_active={body.is_active}")
    if body.is_verified is not None:
        user.is_verified = body.is_verified
        changes.append(f"is_verified={body.is_verified}")

    db.commit()
    db.refresh(user)

    audit_log("patch_user", "User", user_id, current_user, ", ".join(changes))

    return success_response(message="User updated.", data=user)


# ──────────────────────────────────────────────────────────
# PATCH /admin/sites/{site_id}
# ──────────────────────────────────────────────────────────

# ALLOWED_VERIFICATION_STATUSES = {"verified", "unverified", "pending"}
VERIFICATION_STATUS_MAP = {
    "verified":   VerificationStatus.approved,
    "unverified": VerificationStatus.rejected,
    "pending":    VerificationStatus.pending,
}

# @router.patch("/sites/{site_id}")
# def admin_patch_site(
#     site_id: str,
#     body: PatchSiteBody,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(require_roles(UserRole.admin)),
# ):
#     site = db.get(CulturalSite, site_id)
#     if not site:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found.")

#     changes = []
#     if body.verification_status is not None:
#         if body.verification_status not in ALLOWED_VERIFICATION_STATUSES:
#             raise HTTPException(
#                 status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
#                 detail=f"Invalid status. Allowed: {ALLOWED_VERIFICATION_STATUSES}",
#             )
#         site.verification_status = body.verification_status
#         changes.append(f"verification_status={body.verification_status}")

#     db.commit()
#     db.refresh(site)

#     audit_log("patch_site", "CulturalSite", site_id, current_user, ", ".join(changes))

#     return success_response(message="Site updated.", data=site)




@router.patch("/sites/{site_id}")
def admin_patch_site(
    site_id: str,
    body: PatchSiteBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    site = db.get(CulturalSite, site_id)
    if not site:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Site not found.")

    changes = []
    if body.verification_status is not None:
        mapped = VERIFICATION_STATUS_MAP.get(body.verification_status)
        if mapped is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status. Allowed: {list(VERIFICATION_STATUS_MAP.keys())}",
            )
        site.verification_status = mapped
        changes.append(f"verification_status={mapped.value}")

    db.commit()
    db.refresh(site)

    audit_log("patch_site", "CulturalSite", site_id, current_user, ", ".join(changes))
    return success_response(message="Site updated.", data=site)








# ──────────────────────────────────────────────────────────
# PATCH /admin/experiences/{experience_id}
# ──────────────────────────────────────────────────────────

@router.patch("/experiences/{experience_id}")
def admin_patch_experience(
    experience_id: str,
    body: PatchExperienceBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    exp = db.get(Experience, experience_id)
    if not exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Experience not found.")

    changes = []
    if body.status is not None:
        try:
            exp.status = ExperienceStatus(body.status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status. Allowed: {[e.value for e in ExperienceStatus]}",
            )
        changes.append(f"status={body.status}")

    db.commit()
    db.refresh(exp)

    audit_log("patch_experience", "Experience", experience_id, current_user, ", ".join(changes))

    return success_response(message="Experience updated.", data=exp)


# ──────────────────────────────────────────────────────────
# PATCH /admin/packages/{package_id}
# ──────────────────────────────────────────────────────────

@router.patch("/packages/{package_id}")
def admin_patch_package(
    package_id: str,
    body: PatchPackageBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    pkg = db.get(Package, package_id)
    if not pkg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Package not found.")

    changes = []
    if body.status is not None:
        try:
            pkg.status = PackageStatus(body.status)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status. Allowed: {[e.value for e in PackageStatus]}",
            )
        changes.append(f"status={body.status}")

    db.commit()
    db.refresh(pkg)

    audit_log("patch_package", "Package", package_id, current_user, ", ".join(changes))

    return success_response(message="Package updated.", data=pkg)


# ──────────────────────────────────────────────────────────
# PATCH /admin/reports/{report_id}
# (Uncomment Report import when model is ready)
# ──────────────────────────────────────────────────────────

#uncomment and use this after creating the report model

# @router.patch("/reports/{report_id}")
# def admin_patch_report(
#     report_id: str,
#     body: PatchReportBody,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(require_roles(UserRole.admin)),
# ):
#     # from app.models.report import Report
#     # report = db.get(Report, report_id)
#     # if not report:
#     #     raise HTTPException(status_code=404, detail="Report not found.")
#     # if body.status:
#     #     report.status = body.status
#     # db.commit()
#     # audit_log("patch_report", "Report", report_id, current_user, f"status={body.status}")
#     # return success_response(message="Report updated.", data=report)

#     audit_log("patch_report", "Report", report_id, current_user, f"status={body.status}")
#     return success_response(message="Report updated.", data={"id": report_id, "status": body.status})

@router.patch("/reports/{report_id}")
def admin_patch_report(
    report_id: str,
    body: PatchReportBody,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.admin)),
):
    audit_log(
        "patch_report", "Report", report_id, current_user,
        f"status={body.status}" if body.status else "no change",
    )
    return success_response(
        message="Report updated.",
        data={"id": report_id, "status": body.status},
    )

