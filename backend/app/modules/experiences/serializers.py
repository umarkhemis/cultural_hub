
def serialize_experience(experience, current_user=None):
    return {
        "id": str(experience.id),
        "caption": experience.caption,
        "location": experience.location,
        "status": experience.status.value,
        "created_at": experience.created_at,
        "updated_at": experience.updated_at,
        "provider": {
            "id": str(experience.provider.id),
            "site_name": experience.provider.site_name,
            "logo_url": experience.provider.logo_url,
            "location": experience.provider.location,
        },
        "media_items": [
            {
                "id": str(media.id),
                "media_url": media.media_url,
                "media_type": media.media_type.value,
                "thumbnail_url": media.thumbnail_url,
                "media_order": media.media_order,
            }
            for media in experience.media_items
        ],
        "likes_count": getattr(experience, "likes_count", 0),
        "comments_count": getattr(experience, "comments_count", 0),
        "liked_by_current_user": False,
    }