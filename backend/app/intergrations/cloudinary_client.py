
from __future__ import annotations

import cloudinary
import cloudinary.uploader

from app.core.config import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)


def upload_media_file(
    file_path: str,
    *,
    folder: str,
    resource_type: str = "auto",
    public_id: str | None = None,
    overwrite: bool = False,
) -> dict:
    options = {
        "folder": folder,
        "resource_type": resource_type,
        "public_id": public_id,
        "overwrite": overwrite,
    }

    if resource_type == "video":
        return cloudinary.uploader.upload_large(
            file_path,
            chunk_size=6_000_000,
            **options,
        )

    return cloudinary.uploader.upload(
        file_path,
        **options,
    )






























# from __future__ import annotations

# import cloudinary
# import cloudinary.uploader

# from app.core.config import settings


# cloudinary.config(
#     cloud_name=settings.CLOUDINARY_CLOUD_NAME,
#     api_key=settings.CLOUDINARY_API_KEY,
#     api_secret=settings.CLOUDINARY_API_SECRET,
#     secure=True,
# )


# def upload_media_file(
#     file_path: str,
#     *,
#     folder: str,
#     resource_type: str = "auto",
#     public_id: str | None = None,
#     overwrite: bool = False,
# ) -> dict:
#     return cloudinary.uploader.upload(
#         file_path,
#         folder=folder,
#         resource_type=resource_type,
#         public_id=public_id,
#         overwrite=overwrite,
#     )