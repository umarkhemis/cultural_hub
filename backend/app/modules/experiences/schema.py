
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class ExperienceMediaCreate(BaseModel):
    media_url: str = Field(min_length=5, max_length=500)
    media_type: Literal["image", "video"]
    thumbnail_url: str | None = Field(default=None, max_length=500)
    media_order: int = Field(default=0, ge=0)


class ExperienceCreateRequest(BaseModel):
    caption: str = Field(min_length=1, max_length=5000)
    location: str | None = Field(default=None, max_length=255)
    media_items: list[ExperienceMediaCreate] = Field(min_length=1, max_length=10)

    @field_validator("caption")
    @classmethod
    def validate_caption(cls, value: str) -> str:
        return value.strip()


class ExperienceUpdateRequest(BaseModel):
    caption: str | None = Field(default=None, min_length=1, max_length=5000)
    location: str | None = Field(default=None, max_length=255)
    status: Literal["draft", "published", "archived"] | None = None
    media_items: list[ExperienceMediaCreate] | None = None


class CommentCreateRequest(BaseModel):
    comment_text: str = Field(min_length=1, max_length=2000)

    @field_validator("comment_text")
    @classmethod
    def validate_comment(cls, value: str) -> str:
        return value.strip()


class ExperienceMediaResponse(BaseModel):
    id: str
    media_url: str
    media_type: str
    thumbnail_url: str | None
    media_order: int

    class Config:
        from_attributes = True


class ProviderSummaryResponse(BaseModel):
    id: str
    site_name: str
    logo_url: str | None
    location: str | None


class ExperienceResponse(BaseModel):
    id: str
    caption: str
    location: str | None
    status: str
    created_at: datetime
    updated_at: datetime
    provider: ProviderSummaryResponse
    media_items: list[ExperienceMediaResponse]
    likes_count: int
    comments_count: int
    liked_by_current_user: bool = False


class CommentAuthorResponse(BaseModel):
    id: str
    full_name: str
    profile_image_url: str | None


class CommentResponse(BaseModel):
    id: str
    comment_text: str
    created_at: datetime
    author: CommentAuthorResponse


class PaginatedExperienceResponse(BaseModel):
    items: list[ExperienceResponse]
    next_cursor: str | None = None
