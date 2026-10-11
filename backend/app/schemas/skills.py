from __future__ import annotations

from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class Proficiency(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class SkillResponse(BaseModel):
    id: int
    name: str
    category: str


class StudentSkillCreate(BaseModel):
    skill_id: int = Field(gt=0)
    proficiency: Proficiency
    can_teach: bool = False
    years_experience: Decimal | None = Field(default=None, ge=0, le=99.9)


class StudentSkillUpdate(BaseModel):
    proficiency: Proficiency | None = None
    can_teach: bool | None = None
    years_experience: Decimal | None = Field(default=None, ge=0, le=99.9)


class StudentSkillResponse(BaseModel):
    id: int
    skill: SkillResponse
    proficiency: Proficiency
    can_teach: bool
    years_experience: Decimal | None


class LearningGoalCreate(BaseModel):
    skill_id: int = Field(gt=0)
    current_proficiency: Proficiency
    target_proficiency: Proficiency


class LearningGoalResponse(BaseModel):
    id: int
    skill: SkillResponse
    current_proficiency: Proficiency
    target_proficiency: Proficiency
