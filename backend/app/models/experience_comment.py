
import uuid

from sqlalchemy import ForeignKey, Index, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ExperienceComment(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "experience_comments"

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    experience_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("experiences.id", ondelete="CASCADE"),
        nullable=False,
    )
    comment_text: Mapped[str] = mapped_column(Text, nullable=False)

    experience = relationship("Experience", back_populates="comments")

    __table_args__ = (
        Index("ix_experience_comments_user_id", "user_id"),
        Index("ix_experience_comments_experience_id", "experience_id"),
        Index("ix_experience_comments_created_at", "created_at"),
        Index("ix_experience_comments_experience_created", "experience_id", "created_at"),
    )
