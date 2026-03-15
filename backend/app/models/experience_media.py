
import enum
import uuid

from sqlalchemy import Enum, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class MediaType(str, enum.Enum):
    image = "image"
    video = "video"


class ExperienceMedia(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "experience_media"

    experience_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("experiences.id", ondelete="CASCADE"),
        nullable=False,
    )
    media_url: Mapped[str] = mapped_column(String(500), nullable=False)
    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType, name="experience_media_type"),
        nullable=False,
    )
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    media_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    experience = relationship("Experience", back_populates="media_items")

    __table_args__ = (
        Index("ix_experience_media_experience_id", "experience_id"),
        Index("ix_experience_media_media_order", "media_order"),
    )
