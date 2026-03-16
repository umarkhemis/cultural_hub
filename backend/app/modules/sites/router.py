
import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.user import User
from app.modules.sites.follow_service import follow_site, unfollow_site
from app.modules.sites.service import get_public_site_detail, list_public_sites
from app.modules.users.service import get_current_user_optional, get_current_user
from app.utils.responses import success_response

router = APIRouter(prefix="/sites", tags=["Sites"])


@router.get("")
def list_sites(
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    items = list_public_sites(db=db, current_user=current_user)
    return success_response(
        message="Cultural sites retrieved successfully.",
        data={"items": items},
    )


@router.get("/{site_id}")
def site_detail(
    site_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
):
    item = get_public_site_detail(db=db, site_id=site_id, current_user=current_user)
    return success_response(
        message="Cultural site retrieved successfully.",
        data=item,
    )


@router.post("/{site_id}/follow")
def follow_site_endpoint(
    site_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = follow_site(db=db, current_user=current_user, site_id=site_id)
    return success_response(
        message="Cultural site followed successfully.",
        data=result,
    )


@router.delete("/{site_id}/follow")
def unfollow_site_endpoint(
    site_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = unfollow_site(db=db, current_user=current_user, site_id=site_id)
    return success_response(
        message="Cultural site unfollowed successfully.",
        data=result,
    )




























# import uuid

# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session

# from app.database.dependencies import get_db
# from app.modules.sites.service import get_public_site_detail, list_public_sites
# from app.utils.responses import success_response

# router = APIRouter(prefix="/sites", tags=["Sites"])


# @router.get("")
# def list_sites(db: Session = Depends(get_db)):
#     items = list_public_sites(db=db)
#     return success_response(
#         message="Cultural sites retrieved successfully.",
#         data={"items": items},
#     )


# @router.get("/{site_id}")
# def site_detail(site_id: uuid.UUID, db: Session = Depends(get_db)):
#     item = get_public_site_detail(db=db, site_id=site_id)
#     return success_response(
#         message="Cultural site retrieved successfully.",
#         data=item,
#     )