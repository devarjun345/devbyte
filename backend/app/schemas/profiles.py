from __future__ import annotations

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class StudentProfileUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=50)
    full_name: str | None = Field(default=None, min_length=1, max_length=100)
    bio: str | None = None
    college: str | None = Field(default=None, max_length=150)
    branch: str | None = Field(default=None, max_length=100)
    year: int | None = Field(default=None, ge=1, le=10)
    profile_image_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    portfolio_url: HttpUrl | None = None


class MentorProfileUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=50)
    full_name: str | None = Field(default=None, min_length=1, max_length=100)
    bio: str | None = None
    organization: str | None = Field(default=None, max_length=150)
    experience_years: Decimal | None = Field(default=None, ge=0, le=99.9)
    profile_image_url: HttpUrl | None = None
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    website_url: HttpUrl | None = None


class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    username: str
    full_name: str
    bio: str | None
    college: str | None
    branch: str | None
    year: int | None
    profile_image_url: str | None
    github_url: str | None
    linkedin_url: str | None
    portfolio_url: str | None

    model_config = ConfigDict(from_attributes=True)


class MentorProfileResponse(BaseModel):
    id: int
    user_id: int
    username: str
    full_name: str
    bio: str | None
    organization: str | None
    experience_years: Decimal | None
    profile_image_url: str | None
    github_url: str | None
    linkedin_url: str | None
    website_url: str | None

    model_config = ConfigDict(from_attributes=True)
