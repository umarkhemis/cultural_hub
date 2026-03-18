
from pydantic import BaseModel, EmailStr, Field


class SiteUpdateRequest(BaseModel):
    site_name: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = Field(default=None, min_length=10, max_length=5000)
    location: str | None = Field(default=None, min_length=2, max_length=255)
    contact_email: EmailStr | None = None
    contact_phone: str | None = Field(default=None, max_length=30)
    logo_url: str | None = Field(default=None, max_length=500)