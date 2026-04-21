
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.models.booking import Booking
from app.models.cultural_site import CulturalSite
from app.models.experience import Experience
from app.models.package import Package
# from app.models.report import Report
from app.models.user import User, UserRole


def get_admin_overview(db: Session) -> dict:
    total_users = db.scalar(select(func.count(User.id))) or 0
    total_providers = db.scalar(
        select(func.count(User.id)).where(User.role == UserRole.provider)
    ) or 0
    total_sites = db.scalar(select(func.count(CulturalSite.id))) or 0
    total_packages = db.scalar(select(func.count(Package.id))) or 0
    total_experiences = db.scalar(select(func.count(Experience.id))) or 0
    total_bookings = db.scalar(select(func.count(Booking.id))) or 0
    # total_reports = db.scalar(select(func.count(Report.id))) or 0

    return {
        "total_users": int(total_users),
        "total_providers": int(total_providers),
        "total_sites": int(total_sites),
        "total_packages": int(total_packages),
        "total_experiences": int(total_experiences),
        "total_bookings": int(total_bookings),
        "total_reports": 0,
    }


def list_admin_users(db: Session) -> list[User]:
    return list(
        db.scalars(
            select(User).order_by(User.created_at.desc())
        ).all()
    )


def list_admin_sites(db: Session) -> list[CulturalSite]:
    return list(
        db.scalars(
            select(CulturalSite).order_by(CulturalSite.created_at.desc())
        ).all()
    )


def list_admin_bookings(db: Session) -> list[Booking]:
    return list(
        db.scalars(
            select(Booking)
            .options(joinedload(Booking.participants))
            .order_by(Booking.created_at.desc())
        ).unique().all()
    )


def list_admin_experiences(db: Session) -> list[Experience]:
    return list(
        db.scalars(
            select(Experience).order_by(Experience.created_at.desc())
        ).all()
    )


def list_admin_packages(db: Session) -> list[Package]:
    return list(
        db.scalars(
            select(Package).order_by(Package.created_at.desc())
        ).all()
    )


# def list_admin_reports(db: Session) -> list[Report]:
#     return list(
#         db.scalars(
#             select(Report).order_by(Report.created_at.desc())
#         ).all()
#     )