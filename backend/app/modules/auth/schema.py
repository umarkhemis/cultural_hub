
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, model_validator, field_validator


class RegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    password: str = Field(min_length=8, max_length=128)
    role: Literal["tourist", "provider"]

    site_name: str | None = Field(default=None, max_length=200)
    description: str | None = Field(default=None, max_length=2000)
    location: str | None = Field(default=None, max_length=255)
    contact_email: EmailStr | None = None
    contact_phone: str | None = Field(default=None, max_length=30)

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise ValueError("Full name must be at least 2 characters long.")
        return value

    @field_validator("phone", "contact_phone")
    @classmethod
    def normalize_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    @field_validator("site_name", "description", "location")
    @classmethod
    def normalize_provider_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None

    @model_validator(mode="after")
    def validate_role_specific_fields(self):
        if self.role == "provider":
            if not self.site_name:
                raise ValueError("site_name is required for provider registration.")
            if len(self.site_name) < 2:
                raise ValueError("site_name must be at least 2 characters long.")

            if not self.description:
                raise ValueError("description is required for provider registration.")
            if len(self.description) < 10:
                raise ValueError("description must be at least 10 characters long.")

            if not self.location:
                raise ValueError("location is required for provider registration.")
            if len(self.location) < 2:
                raise ValueError("location must be at least 2 characters long.")

            if not self.contact_email and not self.contact_phone:
                raise ValueError(
                    "At least one provider contact is required: contact_email or contact_phone."
                )

        return self


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str | None
    role: str
    profile_image_url: str | None
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse