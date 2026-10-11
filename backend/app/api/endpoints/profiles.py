from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import require_mentor, require_student
from app.db.session import get_db
from app.models import MentorProfile, StudentProfile, User
from app.schemas.profiles import (
    MentorProfileResponse,
    MentorProfileUpdate,
    StudentProfileResponse,
    StudentProfileUpdate,
)
from app.services.profile_service import ProfileConflictError, ProfileService

router = APIRouter()


@router.get("/students/me", response_model=StudentProfileResponse)
def get_my_student_profile(
    current_user: Annotated[User, Depends(require_student)],
) -> StudentProfileResponse:
    if current_user.student_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return _student_response(current_user.student_profile)


@router.patch("/students/me", response_model=StudentProfileResponse)
def update_my_student_profile(
    payload: StudentProfileUpdate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentProfileResponse:
    try:
        profile = ProfileService.update_student(db, current_user, payload.model_dump(exclude_unset=True))
    except ProfileConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return _student_response(profile)


@router.get("/students/{profile_id}", response_model=StudentProfileResponse)
def get_student_profile(
    profile_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> StudentProfileResponse:
    profile = ProfileService.get_student(db, profile_id)
    if profile is None or not profile.user.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return _student_response(profile)


@router.get("/students", response_model=list[StudentProfileResponse])
def list_student_profiles(db: Annotated[Session, Depends(get_db)]) -> list[StudentProfileResponse]:
    return [_student_response(profile) for profile in ProfileService.list_students(db)]


@router.get("/mentors/me", response_model=MentorProfileResponse)
def get_my_mentor_profile(
    current_user: Annotated[User, Depends(require_mentor)],
) -> MentorProfileResponse:
    if current_user.mentor_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor profile not found")
    return _mentor_response(current_user.mentor_profile)


@router.patch("/mentors/me", response_model=MentorProfileResponse)
def update_my_mentor_profile(
    payload: MentorProfileUpdate,
    current_user: Annotated[User, Depends(require_mentor)],
    db: Annotated[Session, Depends(get_db)],
) -> MentorProfileResponse:
    try:
        profile = ProfileService.update_mentor(db, current_user, payload.model_dump(exclude_unset=True))
    except ProfileConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return _mentor_response(profile)


@router.get("/mentors/{profile_id}", response_model=MentorProfileResponse)
def get_mentor_profile(
    profile_id: int,
    db: Annotated[Session, Depends(get_db)],
) -> MentorProfileResponse:
    profile = ProfileService.get_mentor(db, profile_id)
    if profile is None or not profile.user.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mentor profile not found")
    return _mentor_response(profile)


@router.get("/mentors", response_model=list[MentorProfileResponse])
def list_mentor_profiles(db: Annotated[Session, Depends(get_db)]) -> list[MentorProfileResponse]:
    return [_mentor_response(profile) for profile in ProfileService.list_mentors(db)]


def _student_response(student: StudentProfile) -> StudentProfileResponse:
    return StudentProfileResponse(
        id=student.id,
        user_id=student.user_id,
        username=student.user.username,
        full_name=student.full_name,
        bio=student.bio,
        college=student.college,
        branch=student.branch,
        year=student.year,
        profile_image_url=student.profile_image_url,
        github_url=student.github_url,
        linkedin_url=student.linkedin_url,
        portfolio_url=student.portfolio_url,
    )


def _mentor_response(mentor: MentorProfile) -> MentorProfileResponse:
    return MentorProfileResponse(
        id=mentor.id,
        user_id=mentor.user_id,
        username=mentor.user.username,
        full_name=mentor.full_name,
        bio=mentor.bio,
        organization=mentor.organization,
        experience_years=mentor.experience_years,
        profile_image_url=mentor.profile_image_url,
        github_url=mentor.github_url,
        linkedin_url=mentor.linkedin_url,
        website_url=mentor.website_url,
    )
