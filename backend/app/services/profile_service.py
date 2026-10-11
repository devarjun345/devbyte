from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from sqlalchemy.orm import Session

from app.models import MentorProfile, StudentProfile, User


class ProfileConflictError(ValueError):
    pass


class ProfileService:
    @staticmethod
    def _update_user_username(db: Session, user: User, values: dict[str, Any]) -> None:
        username = values.pop("username", None)
        if username is None or username == user.username:
            return
        existing = db.query(User).filter(
            User.username == username,
            User.id != user.id,
        ).first()
        if existing is not None:
            raise ProfileConflictError("Username already taken")
        user.username = username

    @staticmethod
    def update_student(db: Session, user: User, changes: Mapping[str, Any]) -> StudentProfile:
        profile = user.student_profile
        if profile is None:
            raise LookupError("Student profile not found")
        values = dict(changes)
        ProfileService._update_user_username(db, user, values)
        for field, value in values.items():
            setattr(profile, field, value)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def update_mentor(db: Session, user: User, changes: Mapping[str, Any]) -> MentorProfile:
        profile = user.mentor_profile
        if profile is None:
            raise LookupError("Mentor profile not found")
        values = dict(changes)
        ProfileService._update_user_username(db, user, values)
        for field, value in values.items():
            setattr(profile, field, value)
        db.commit()
        db.refresh(profile)
        return profile

    @staticmethod
    def get_student(db: Session, profile_id: int) -> StudentProfile | None:
        return db.get(StudentProfile, profile_id)

    @staticmethod
    def list_students(db: Session) -> list[StudentProfile]:
        return db.query(StudentProfile).join(User).filter(User.is_active.is_(True)).all()

    @staticmethod
    def get_mentor(db: Session, profile_id: int) -> MentorProfile | None:
        return db.get(MentorProfile, profile_id)

    @staticmethod
    def list_mentors(db: Session) -> list[MentorProfile]:
        return db.query(MentorProfile).join(User).filter(User.is_active.is_(True)).all()
