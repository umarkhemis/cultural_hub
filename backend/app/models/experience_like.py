
import uuid

from sqlalchemy import ForeignKey, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ExperienceLike(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "experience_likes"

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

    experience = relationship("Experience", back_populates="likes")

    __table_args__ = (
        UniqueConstraint("user_id", "experience_id", name="uq_experience_like_user_experience"),
        Index("ix_experience_likes_user_id", "user_id"),
        Index("ix_experience_likes_experience_id", "experience_id"),
    )
