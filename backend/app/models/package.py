
import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class PackageStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    archived = "archived"
    cancelled = "cancelled"


class Package(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "packages"

    provider_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("cultural_sites.id", ondelete="CASCADE"),
        nullable=False,
    )
    package_name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    duration: Mapped[str | None] = mapped_column(String(100), nullable=True)
    event_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    includes_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[PackageStatus] = mapped_column(
        Enum(PackageStatus, name="package_status"),
        nullable=False,
        default=PackageStatus.published,
    )

    provider = relationship("CulturalSite")
    media_items = relationship(
        "PackageMedia",
        back_populates="package",
        cascade="all, delete-orphan",
        order_by="PackageMedia.media_order.asc()",
    )

    __table_args__ = (
        Index("ix_packages_provider_id", "provider_id"),
        Index("ix_packages_status", "status"),
        Index("ix_packages_event_date", "event_date"),
        Index("ix_packages_created_at", "created_at"),
        Index("ix_packages_status_event_date", "status", "event_date"),
        Index("ix_packages_provider_status", "provider_id", "status"),
    )