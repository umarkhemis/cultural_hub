
import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile, status

from app.core.config import settings
from app.core.permissions import require_roles
from app.intergrations.cloudinary_client import upload_media_file
from app.models.user import User, UserRole
from app.utils.exceptions import ValidationException
from app.utils.responses import success_response

router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/mpeg"}

MAX_IMAGE_SIZE = 10 * 1024 * 1024
MAX_VIDEO_SIZE = 100 * 1024 * 1024


@router.post("/media", status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles(UserRole.provider, UserRole.admin)),
):
    content_type = file.content_type or ""

    if content_type in ALLOWED_IMAGE_TYPES:
        media_kind = "image"
        max_size = MAX_IMAGE_SIZE
    elif content_type in ALLOWED_VIDEO_TYPES:
        media_kind = "video"
        max_size = MAX_VIDEO_SIZE
    else:
        raise ValidationException("Unsupported file type.")

    file_bytes = await file.read()
    if not file_bytes:
        raise ValidationException("Uploaded file is empty.")

    if len(file_bytes) > max_size:
        raise ValidationException(
            f"{media_kind.capitalize()} exceeds maximum allowed size."
        )

    suffix = Path(file.filename or "upload").suffix or ""
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file_bytes)
        temp_path = tmp.name

    try:
        result = upload_media_file(
            temp_path,
            folder=f"{settings.CLOUDINARY_UPLOAD_FOLDER}/{media_kind}s",
            resource_type="video" if media_kind == "video" else "image",
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return success_response(
        message="Media uploaded successfully.",
        data={
            "resource_type": media_kind,
            "public_id": result.get("public_id"),
            "secure_url": result.get("secure_url"),
            "width": result.get("width"),
            "height": result.get("height"),
            "duration": result.get("duration"),
            "format": result.get("format"),
        },
    )
































# import os
# import tempfile
# from pathlib import Path

# from fastapi import APIRouter, Depends, File, UploadFile, status

# from app.core.permissions import require_roles
# from app.core.config import settings
# from app.intergrations.cloudinary_client import upload_media_file
# from app.models.user import User, UserRole
# from app.utils.exceptions import ValidationException
# from app.utils.responses import success_response

# router = APIRouter(prefix="/uploads", tags=["Uploads"])


# ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
# ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}


# @router.post("/media", status_code=status.HTTP_201_CREATED)
# async def upload_media(
#     file: UploadFile = File(...),
#     current_user: User = Depends(
#         require_roles(UserRole.provider, UserRole.admin)
#     ),
# ):
#     content_type = file.content_type or ""

#     if content_type in ALLOWED_IMAGE_TYPES:
#         media_kind = "image"
#     elif content_type in ALLOWED_VIDEO_TYPES:
#         media_kind = "video"
#     else:
#         raise ValidationException("Unsupported file type.")

#     suffix = Path(file.filename or "upload").suffix or ""
#     with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
#         tmp.write(await file.read())
#         temp_path = tmp.name

#     try:
#         result = upload_media_file(
#             temp_path,
#             folder=f"{settings.CLOUDINARY_UPLOAD_FOLDER}/{media_kind}s",
#             resource_type="video" if media_kind == "video" else "image",
#         )
#     finally:
#         if os.path.exists(temp_path):
#             os.remove(temp_path)

#     return success_response(
#         message="Media uploaded successfully.",
#         data={
#             "resource_type": media_kind,
#             "public_id": result.get("public_id"),
#             "secure_url": result.get("secure_url"),
#             "width": result.get("width"),
#             "height": result.get("height"),
#             "duration": result.get("duration"),
#             "format": result.get("format"),
#         },
#     )