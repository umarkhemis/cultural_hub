
from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class UserRole(str, Enum):
    TOURIST = "tourist"
    PROVIDER = "provider"
    ADMIN = "admin"

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str]
    password: str
    role: UserRole

class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: Optional[str]
    role: UserRole
    profile_image: Optional[str]

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"