
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.permissions import require_roles
from app.database.dependencies import get_db
from app.models.user import User, UserRole
from app.modules.providers.schema import ProviderCompleteProfileRequest
from app.modules.providers.service import complete_provider_profile
from app.utils.responses import success_response

router = APIRouter(prefix="/providers", tags=["Providers"])


@router.post("/complete-profile", status_code=status.HTTP_201_CREATED)
def complete_provider_profile_endpoint(
    payload: ProviderCompleteProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(UserRole.provider)),
):
    result = complete_provider_profile(
        db=db,
        current_user=current_user,
        payload=payload,
    )
    return success_response(
        message="Provider profile completed successfully.",
        data=result,
    )