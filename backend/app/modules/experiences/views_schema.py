
from pydantic import BaseModel, Field


class ExperienceViewCreateRequest(BaseModel):
    experience_id: str
    session_id: str | None = Field(default=None, max_length=100)
    watch_seconds: int = Field(default=2, ge=0)
    completed: bool = False