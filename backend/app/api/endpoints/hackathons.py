from __future__ import annotations

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_optional_current_user, require_student
from app.db.session import get_db
from app.models import Hackathon, HackathonMode, HackathonStatus, User
from app.schemas.hackathons import HackathonBookmarkRemoveResponse, HackathonBookmarkResponse, HackathonListResponse, HackathonResponse
from app.services.hackathon_service import HackathonConflictError, HackathonNotFoundError, HackathonService

router = APIRouter()


@router.get("/hackathons", response_model=HackathonListResponse)
def list_hackathons(
    q: str | None = Query(default=None),
    mode: HackathonMode | None = None,
    location: str | None = None,
    source: str | None = None,
    status: HackathonStatus | None = None,
    skill_id: int | None = None,
    skill_ids: list[int] | None = Query(default=None),
    deadline_after: datetime | None = None,
    deadline_before: datetime | None = None,
    start_after: datetime | None = None,
    start_before: datetime | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: Annotated[User | None, Depends(get_optional_current_user)] = None,
    db: Annotated[Session, Depends(get_db)] = None,
) -> HackathonListResponse:
    student = current_user.student_profile if current_user and current_user.student_profile else None
    selected_skill_ids = []
    if skill_id is not None:
        selected_skill_ids.append(skill_id)
    if skill_ids:
        selected_skill_ids.extend(skill_ids)
    selected_skill_ids = list(dict.fromkeys(selected_skill_ids))

    items, total = HackathonService.list(
        db,
        q=q,
        mode=mode.value if mode else None,
        location=location,
        source=source,
        status=status.value if status else None,
        skill_ids=selected_skill_ids,
        deadline_after=deadline_after,
        deadline_before=deadline_before,
        start_after=start_after,
        start_before=start_before,
        page=page,
        page_size=page_size,
    )
    return HackathonListResponse(
        items=[_hackathon_response(item, student) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/hackathons/{hackathon_id}", response_model=HackathonResponse)
def get_hackathon(
    hackathon_id: int,
    current_user: Annotated[User | None, Depends(get_optional_current_user)] = None,
    db: Annotated[Session, Depends(get_db)] = None,
) -> HackathonResponse:
    student = current_user.student_profile if current_user and current_user.student_profile else None
    try:
        item = HackathonService.get(db, hackathon_id)
    except HackathonNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return _hackathon_response(item, student)


@router.post("/hackathons/{hackathon_id}/bookmark", response_model=HackathonBookmarkResponse, status_code=status.HTTP_201_CREATED)
def bookmark_hackathon(
    hackathon_id: int,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> HackathonBookmarkResponse:
    student = _student_profile(current_user)
    try:
        bookmark, created = HackathonService.bookmark(db, student, hackathon_id)
    except HackathonNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except HackathonConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return HackathonBookmarkResponse(hackathon_id=bookmark.hackathon_id, bookmarked=True, student_id=student.id)


@router.delete("/hackathons/{hackathon_id}/bookmark", response_model=HackathonBookmarkRemoveResponse)
def unbookmark_hackathon(
    hackathon_id: int,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> HackathonBookmarkRemoveResponse:
    student = _student_profile(current_user)
    try:
        removed = HackathonService.remove_bookmark(db, student, hackathon_id)
    except HackathonNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return HackathonBookmarkRemoveResponse(hackathon_id=hackathon_id, bookmarked=not removed)


@router.get("/hackathons/me/bookmarks", response_model=list[HackathonResponse])
def list_bookmarks(
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[HackathonResponse]:
    student = _student_profile(current_user)
    return [_hackathon_response(item, student) for item in HackathonService.list_bookmarks(db, student)]


def _student_profile(user: User):
    if user.student_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return user.student_profile


def _hackathon_response(hackathon: Hackathon, student=None) -> HackathonResponse:
    return HackathonResponse(
        id=hackathon.id,
        title=hackathon.title,
        organizer=hackathon.organizer,
        description=hackathon.description,
        mode=hackathon.mode,
        location=hackathon.location,
        registration_url=hackathon.registration_url,
        source=hackathon.source,
        source_event_id=hackathon.source_event_id,
        source_url=hackathon.source_url,
        deadline=hackathon.deadline.isoformat() if hackathon.deadline else None,
        start_date=hackathon.start_date.isoformat() if hackathon.start_date else None,
        end_date=hackathon.end_date.isoformat() if hackathon.end_date else None,
        prize_description=hackathon.prize_description,
        team_size_min=hackathon.team_size_min,
        team_size_max=hackathon.team_size_max,
        banner_url=hackathon.banner_url,
        status=hackathon.status,
        last_synced_at=hackathon.last_synced_at.isoformat() if hackathon.last_synced_at else None,
        is_bookmarked=HackathonService.is_bookmarked(student if student else None, hackathon.id),
        skills=[
            {
                "id": item.skill.id,
                "name": item.skill.name,
                "category": item.skill.category,
            }
            for item in hackathon.hackathon_skills
        ],
    )
