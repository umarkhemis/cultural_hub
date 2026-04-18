
from pydantic import BaseModel, EmailStr, Field


class ProviderCompleteProfileRequest(BaseModel):
    site_name: str = Field(min_length=2, max_length=255)
    location: str = Field(min_length=2, max_length=255)
    description: str = Field(min_length=10, max_length=2000)
    contact_email: EmailStr | None = None
    contact_phone: str | None = Field(default=None, max_length=30)