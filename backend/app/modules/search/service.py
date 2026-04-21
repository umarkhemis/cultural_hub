

from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from app.models.cultural_site import CulturalSite
from app.models.experience import Experience, ExperienceStatus
from app.models.experience_media import ExperienceMedia
from app.models.package import Package, PackageStatus

def search_all(db: Session, q: str) -> dict:
    term = f"%{q.lower()}%"

    # Search cultural sites
    sites = db.execute(
        select(CulturalSite)
        .where(
            or_(
                func.lower(CulturalSite.site_name).like(term),
                func.lower(CulturalSite.location).like(term),
                func.lower(CulturalSite.description).like(term),
            )
        )
        .limit(8)
    ).scalars().all()

    # Search experiences
    experiences = db.execute(
        select(Experience)
        .where(
            Experience.status == ExperienceStatus.published,
            or_(
                func.lower(Experience.caption).like(term),
                func.lower(Experience.location).like(term),
            )
        )
        .limit(8)
    ).scalars().all()

    # Search packages
    packages = db.execute(
        select(Package)
        .where(
            Package.status == PackageStatus.published,
            or_(
                func.lower(Package.package_name).like(term),
                func.lower(Package.description).like(term),
            )
        )
        .limit(8)
    ).scalars().all()

    return {
        "sites": [
            {
                "id": str(s.id),
                "site_name": s.site_name,
                "location": s.location,
                "logo_url": s.logo_url,
                "verification_status": s.verification_status,
            }
            for s in sites
        ],
        "experiences": [
            {
                "id": str(e.id),
                "caption": e.caption,
                "location": e.location,
                "provider_id": str(e.provider_id),
            }
            for e in experiences
        ],
        "packages": [
            {
                "id": str(p.id),
                "package_name": p.package_name,
                "description": p.description,
                "price": float(p.price),
                "provider_id": str(p.provider_id),
            }
            for p in packages
        ],
    }
