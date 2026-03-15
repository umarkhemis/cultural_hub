
import enum
import uuid
from datetime import datetime

from sqlalchemy import Enum, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ExperienceStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"
    removed = "removed"


class Experience(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "experiences"

    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cultural_sites.id", ondelete="CASCADE"),
        nullable=False,
    )
    caption: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[ExperienceStatus] = mapped_column(
        Enum(ExperienceStatus, name="experience_status"),
        nullable=False,
        default=ExperienceStatus.published,
    )

    provider = relationship("CulturalSite")
    media_items = relationship(
        "ExperienceMedia",
        back_populates="experience",
        cascade="all, delete-orphan",
        order_by="ExperienceMedia.media_order.asc()",
    )
    likes = relationship(
        "ExperienceLike",
        back_populates="experience",
        cascade="all, delete-orphan",
    )
    comments = relationship(
        "ExperienceComment",
        back_populates="experience",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_experiences_provider_id", "provider_id"),
        Index("ix_experiences_status", "status"),
        Index("ix_experiences_created_at", "created_at"),
        Index("ix_experiences_location", "location"),
        Index("ix_experiences_status_created_at", "status", "created_at"),
    )
