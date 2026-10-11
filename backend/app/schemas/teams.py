from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict, Field

from app.models import ProficiencyLevel


class TeamInvitationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class TeamRequirementSkillInput(BaseModel):
    skill_id: int = Field(gt=0)


class TeamRequirementCreate(BaseModel):
    role_title: str = Field(min_length=1, max_length=100)
    description: str | None = None
    slots: int = Field(default=1, gt=0)
    experience_level: ProficiencyLevel | None = None
    is_open: bool = True
    skill_ids: list[int] = Field(default_factory=list)


class TeamRequirementUpdate(BaseModel):
    role_title: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    slots: int | None = Field(default=None, gt=0)
    experience_level: ProficiencyLevel | None = None
    is_open: bool | None = None
    skill_ids: list[int] | None = None


class TeamCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    is_public: bool = True
    max_members: int = Field(default=5, gt=0)
    requirements: list[TeamRequirementCreate] = Field(default_factory=list)


class TeamUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = None
    is_public: bool | None = None
    max_members: int | None = Field(default=None, gt=0)
    requirements: list[TeamRequirementCreate] | None = None


class TeamInvitationCreate(BaseModel):
    invitee_student_id: int = Field(gt=0)
    message: str | None = None


class TeamInvitationDecision(BaseModel):
    status: TeamInvitationStatus


class TeamMemberResponse(BaseModel):
    student_id: int
    username: str
    full_name: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class TeamRequirementSkillResponse(BaseModel):
    skill_id: int
    name: str
    category: str


class TeamRequirementResponse(BaseModel):
    id: int
    role_title: str
    description: str | None
    slots: int
    experience_level: str | None
    is_open: bool
    skills: list[TeamRequirementSkillResponse]

    model_config = ConfigDict(from_attributes=True)


class TeamInvitationResponse(BaseModel):
    id: int
    team_id: int
    inviter_student_id: int
    invitee_student_id: int
    status: str
    message: str | None

    model_config = ConfigDict(from_attributes=True)


class TeamResponse(BaseModel):
    id: int
    name: str
    description: str | None
    owner_student_id: int
    owner_username: str
    owner_full_name: str
    is_public: bool
    max_members: int
    members: list[TeamMemberResponse]
    requirements: list[TeamRequirementResponse]

    model_config = ConfigDict(from_attributes=True)
