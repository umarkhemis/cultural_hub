
import uuid

from sqlalchemy import Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ContentTranslation(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "content_translations"

    source_type: Mapped[str] = mapped_column(String(50), nullable=False)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    field_name: Mapped[str] = mapped_column(String(50), nullable=False)
    source_language: Mapped[str] = mapped_column(String(10), nullable=False, default="en")
    target_language: Mapped[str] = mapped_column(String(10), nullable=False)
    source_text_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    translated_text: Mapped[str] = mapped_column(Text, nullable=False)

    __table_args__ = (
        Index(
            "ix_content_translation_lookup",
            "source_type",
            "source_id",
            "field_name",
            "target_language",
            unique=True,
        ),
    )