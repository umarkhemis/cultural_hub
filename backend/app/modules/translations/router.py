
# app/modules/translations/router.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.modules.translations.service import (
    translate_experience_payload,
    translate_package_payload,
    translate_site_payload,
)
from app.utils.responses import success_response

router = APIRouter(prefix="/translations", tags=["Translations"])


@router.get("/experiences/{experience_id}")
def translate_experience(
    experience_id: str,
    lang: str = Query(..., min_length=2, max_length=10),
    db: Session = Depends(get_db),
):
    return success_response(
        message="Experience translated successfully.",
        data=translate_experience_payload(db=db, experience_id=experience_id, target_language=lang),
    )


@router.get("/packages/{package_id}")
def translate_package(
    package_id: str,
    lang: str = Query(..., min_length=2, max_length=10),
    db: Session = Depends(get_db),
):
    return success_response(
        message="Package translated successfully.",
        data=translate_package_payload(db=db, package_id=package_id, target_language=lang),
    )


@router.get("/sites/{site_id}")
def translate_site(
    site_id: str,
    lang: str = Query(..., min_length=2, max_length=10),
    db: Session = Depends(get_db),
):
    return success_response(
        message="Site translated successfully.",
        data=translate_site_payload(db=db, site_id=site_id, target_language=lang),
    )