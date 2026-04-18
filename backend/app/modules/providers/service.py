
from sqlalchemy.orm import Session

from app.models.cultural_site import CulturalSite, VerificationStatus
from app.models.user import User
from app.modules.providers.schema import ProviderCompleteProfileRequest
from app.utils.exceptions import ConflictException


def complete_provider_profile(
    db: Session,
    current_user: User,
    payload: ProviderCompleteProfileRequest,
) -> dict:
    if current_user.cultural_site is not None:
        raise ConflictException("Provider site profile already exists.")

    site = CulturalSite(
        user_id=current_user.id,
        site_name=payload.site_name.strip(),
        description=payload.description.strip(),
        location=payload.location.strip(),
        contact_email=(payload.contact_email or current_user.email).lower(),
        contact_phone=payload.contact_phone or current_user.phone,
        verification_status=VerificationStatus.pending,
        is_active=True,
    )

    db.add(site)
    db.commit()
    db.refresh(site)

    return {
        "id": str(site.id),
        "site_name": site.site_name,
        "description": site.description,
        "location": site.location,
        "contact_email": site.contact_email,
        "contact_phone": site.contact_phone,
        "verification_status": site.verification_status.value,
        "is_active": site.is_active,
    }