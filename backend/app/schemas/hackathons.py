from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class HackathonMode(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    HYBRID = "hybrid"


class HackathonStatus(str, Enum):
    UPCOMING = "upcoming"
    ACTIVE = "active"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class HackathonSkillResponse(BaseModel):
    id: int
    name: str
    category: str


class HackathonResponse(BaseModel):
    id: int
    title: str
    organizer: str
    description: str
    mode: HackathonMode
    location: str | None = None
    registration_url: str
    source: str
    source_event_id: str | None = None
    source_url: str | None = None
    deadline: str
    start_date: str | None = None
    end_date: str | None = None
    prize_description: str | None = None
    team_size_min: int | None = None
    team_size_max: int | None = None
    banner_url: str | None = None
    status: HackathonStatus
    last_synced_at: str | None = None
    is_bookmarked: bool = False
    skills: list[HackathonSkillResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class HackathonListResponse(BaseModel):
    items: list[HackathonResponse]
    total: int
    page: int
    page_size: int


class HackathonBookmarkResponse(BaseModel):
    hackathon_id: int
    bookmarked: bool
    student_id: int


class HackathonBookmarkRemoveResponse(BaseModel):
    hackathon_id: int
    bookmarked: bool
