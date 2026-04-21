
# app/modules/translations/service.py
import hashlib
import uuid
import httpx

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.content_translation import ContentTranslation
from app.models.experience import Experience
from app.models.package import Package
from app.models.cultural_site import CulturalSite
from app.utils.exceptions import NotFoundException, ValidationException

SUPPORTED_TRANSLATION_LANGUAGES = {
    "en", "sw", "fr", "zh-CN", "de", "ar", "es", "pt",
}

# Google uses "zh" not "zh-CN" for simplified Chinese
LANGUAGE_CODE_MAP = {
    "zh-CN": "zh",
}


def hash_text(value: str) -> str:
    return hashlib.sha256(value.strip().encode("utf-8")).hexdigest()


def translate_text_external(text: str, target_language: str) -> str:
    if not text or not text.strip():
        return text

    if not settings.GOOGLE_TRANSLATE_API_KEY:
        return text  # fallback — return original if no key

    google_lang = LANGUAGE_CODE_MAP.get(target_language, target_language)

    try:
        response = httpx.post(
            "https://translation.googleapis.com/language/translate/v2",
            params={"key": settings.GOOGLE_TRANSLATE_API_KEY},
            json={
                "q": text,
                "source": "en",
                "target": google_lang,
                "format": "text",
            },
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["data"]["translations"][0]["translatedText"]
    except Exception:
        return text  # fallback — return original on any error


def get_or_create_translation(
    db: Session,
    source_type: str,
    source_id: uuid.UUID,
    field_name: str,
    source_text: str,
    target_language: str,
) -> str:
    if not source_text or not source_text.strip():
        return source_text

    if target_language not in SUPPORTED_TRANSLATION_LANGUAGES:
        raise ValidationException("Unsupported target language.")

    if target_language == "en":
        return source_text

    source_hash = hash_text(source_text)

    existing = db.scalar(
        select(ContentTranslation).where(
            ContentTranslation.source_type == source_type,
            ContentTranslation.source_id == source_id,
            ContentTranslation.field_name == field_name,
            ContentTranslation.target_language == target_language,
            ContentTranslation.source_text_hash == source_hash,
        )
    )
    if existing:
        return existing.translated_text

    translated_text = translate_text_external(source_text, target_language)

    row = ContentTranslation(
        source_type=source_type,
        source_id=source_id,
        field_name=field_name,
        source_language="en",
        target_language=target_language,
        source_text_hash=source_hash,
        translated_text=translated_text,
    )
    db.add(row)
    db.commit()

    return translated_text


def _translate_fields(db, source_type, source_id, fields: dict, target_language: str) -> dict:
    """Translate a dict of {field_name: source_text} and return {field_name: translated_text}."""
    return {
        field: get_or_create_translation(
            db=db,
            source_type=source_type,
            source_id=source_id,
            field_name=field,
            source_text=text,
            target_language=target_language,
        )
        for field, text in fields.items()
    }


def translate_experience_payload(db: Session, experience_id: str, target_language: str) -> dict:
    experience = db.get(Experience, experience_id)
    if not experience:
        raise NotFoundException("Experience not found.")

    translated = _translate_fields(db, "experience", experience.id, {
        "caption": experience.caption or "",
        "location": experience.location or "",
    }, target_language)

    return {"id": str(experience.id), "target_language": target_language, **translated}


def translate_package_payload(db: Session, package_id: str, target_language: str) -> dict:
    package = db.get(Package, package_id)
    if not package:
        raise NotFoundException("Package not found.")

    translated = _translate_fields(db, "package", package.id, {
        "package_name": package.package_name or "",
        "description": package.description or "",
    }, target_language)

    return {"id": str(package.id), "target_language": target_language, **translated}


def translate_site_payload(db: Session, site_id: str, target_language: str) -> dict:
    site = db.get(CulturalSite, site_id)
    if not site:
        raise NotFoundException("Site not found.")

    translated = _translate_fields(db, "site", site.id, {
        "site_name": site.site_name or "",
        "description": site.description or "",
        "location": site.location or "",
    }, target_language)

    return {"id": str(site.id), "target_language": target_language, **translated}

