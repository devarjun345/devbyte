from __future__ import annotations

from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field, HttpUrl


class ProjectStatus(str, Enum):
    IDEA = "idea"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ProjectSkillResponse(BaseModel):
    id: int
    name: str
    category: str


class ProjectMemberResponse(BaseModel):
    student_id: int
    username: str
    role: str | None


class ProjectCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(min_length=1)
    category: str | None = Field(default=None, max_length=100)
    status: ProjectStatus = ProjectStatus.IN_PROGRESS
    github_url: HttpUrl | None = None
    demo_url: HttpUrl | None = None
    image_url: HttpUrl | None = None
    is_public: bool = True
    team_id: int | None = Field(default=None, gt=0)
    skill_ids: list[int] = Field(default_factory=list)


class ProjectUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=150)
    description: str | None = Field(default=None, min_length=1)
    category: str | None = Field(default=None, max_length=100)
    status: ProjectStatus | None = None
    github_url: HttpUrl | None = None
    demo_url: HttpUrl | None = None
    image_url: HttpUrl | None = None
    is_public: bool | None = None
    team_id: int | None = Field(default=None, gt=0)
    skill_ids: list[int] | None = None


class ProjectResponse(BaseModel):
    id: int
    owner_student_id: int
    team_id: int | None
    title: str
    description: str
    category: str | None
    status: ProjectStatus
    github_url: str | None
    demo_url: str | None
    image_url: str | None
    is_public: bool
    skills: list[ProjectSkillResponse]
    members: list[ProjectMemberResponse]
    owner_username: str
    owner_full_name: str
