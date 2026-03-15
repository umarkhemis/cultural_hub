
import uuid

from sqlalchemy import ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class PackageMedia(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "package_media"

    package_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("packages.id", ondelete="CASCADE"),
        nullable=False,
    )
    media_url: Mapped[str] = mapped_column(String(500), nullable=False)
    thumbnail_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    media_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    package = relationship("Package", back_populates="media_items")

    __table_args__ = (
        Index("ix_package_media_package_id", "package_id"),
        Index("ix_package_media_media_order", "media_order"),
    )