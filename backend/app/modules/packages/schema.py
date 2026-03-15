
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, Field, field_validator


class PackageMediaCreate(BaseModel):
    media_url: str = Field(min_length=5, max_length=500)
    thumbnail_url: str | None = Field(default=None, max_length=500)
    media_order: int = Field(default=0, ge=0)


class PackageCreateRequest(BaseModel):
    package_name: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=5, max_length=5000)
    price: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    duration: str | None = Field(default=None, max_length=100)
    event_date: datetime | None = None
    includes_text: str | None = None
    media_items: list[PackageMediaCreate] = Field(default_factory=list, max_length=10)

    @field_validator("package_name", "description")
    @classmethod
    def strip_text(cls, value: str) -> str:
        return value.strip()


class PackageUpdateRequest(BaseModel):
    package_name: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = Field(default=None, min_length=5, max_length=5000)
    price: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    duration: str | None = Field(default=None, max_length=100)
    event_date: datetime | None = None
    includes_text: str | None = None
    status: str | None = None
    media_items: list[PackageMediaCreate] | None = None