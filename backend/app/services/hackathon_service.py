from __future__ import annotations

from collections.abc import Mapping
from datetime import datetime
from typing import Any

from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.models import Hackathon, HackathonBookmark, HackathonSkill, Skill, StudentProfile


class HackathonNotFoundError(LookupError):
    pass


class HackathonConflictError(ValueError):
    pass


class HackathonService:
    @staticmethod
    def list(
        db: Session,
        *,
        q: str | None = None,
        mode: str | None = None,
        location: str | None = None,
        source: str | None = None,
        status: str | None = None,
        skill_ids: list[int] | None = None,
        deadline_after: datetime | None = None,
        deadline_before: datetime | None = None,
        start_after: datetime | None = None,
        start_before: datetime | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Hackathon], int]:
        page = max(1, page)
        page_size = min(max(1, page_size), 100)
        query = (
            db.query(Hackathon)
            .options(
                joinedload(Hackathon.hackathon_skills).joinedload(HackathonSkill.skill),
            )
            .order_by(Hackathon.deadline.asc(), Hackathon.id.asc())
        )

        if q:
            q_text = f"%{q.strip()}%"
            query = query.filter(
                or_(
                    Hackathon.title.ilike(q_text),
                    Hackathon.organizer.ilike(q_text),
                    Hackathon.description.ilike(q_text),
                    Hackathon.location.ilike(q_text),
                )
            )

        if mode:
            query = query.filter(Hackathon.mode == mode)
        if location:
            query = query.filter(Hackathon.location.ilike(f"%{location.strip()}%"))
        if source:
            query = query.filter(Hackathon.source == source)
        if status:
            query = query.filter(Hackathon.status == status)
        if skill_ids:
            unique_skill_ids = list(dict.fromkeys(skill_ids))
            query = query.filter(Hackathon.hackathon_skills.any(HackathonSkill.skill_id.in_(unique_skill_ids)))
        if deadline_after is not None:
            query = query.filter(Hackathon.deadline >= deadline_after)
        if deadline_before is not None:
            query = query.filter(Hackathon.deadline <= deadline_before)
        if start_after is not None:
            query = query.filter(Hackathon.start_date >= start_after)
        if start_before is not None:
            query = query.filter(Hackathon.start_date <= start_before)

        total = query.count()
        items = query.offset((page - 1) * page_size).limit(page_size).all()
        return items, total

    @staticmethod
    def get(db: Session, hackathon_id: int) -> Hackathon:
        hackathon = db.get(Hackathon, hackathon_id)
        if hackathon is None:
            raise HackathonNotFoundError("Hackathon not found")
        return hackathon

    @staticmethod
    def bookmark(db: Session, student: StudentProfile, hackathon_id: int) -> tuple[HackathonBookmark, bool]:
        hackathon = HackathonService.get(db, hackathon_id)
        existing = (
            db.query(HackathonBookmark)
            .filter(HackathonBookmark.student_id == student.id, HackathonBookmark.hackathon_id == hackathon.id)
            .first()
        )
        if existing is not None:
            return existing, False
        bookmark = HackathonBookmark(student_id=student.id, hackathon_id=hackathon.id)
        db.add(bookmark)
        db.commit()
        db.refresh(bookmark)
        return bookmark, True

    @staticmethod
    def remove_bookmark(db: Session, student: StudentProfile, hackathon_id: int) -> bool:
        HackathonService.get(db, hackathon_id)
        bookmark = (
            db.query(HackathonBookmark)
            .filter(HackathonBookmark.student_id == student.id, HackathonBookmark.hackathon_id == hackathon_id)
            .first()
        )
        if bookmark is None:
            return False
        db.delete(bookmark)
        db.commit()
        return True

    @staticmethod
    def list_bookmarks(db: Session, student: StudentProfile) -> list[Hackathon]:
        return (
            db.query(Hackathon)
            .join(HackathonBookmark, HackathonBookmark.hackathon_id == Hackathon.id)
            .filter(HackathonBookmark.student_id == student.id)
            .order_by(Hackathon.deadline.asc(), Hackathon.id.asc())
            .all()
        )

    @staticmethod
    def is_bookmarked(db: Session, student: StudentProfile | None, hackathon_id: int) -> bool:
        if student is None:
            return False
        return (
            db.query(HackathonBookmark.id)
            .filter(HackathonBookmark.student_id == student.id, HackathonBookmark.hackathon_id == hackathon_id)
            .first()
            is not None
        )

    @staticmethod
    def upsert_record(db: Session, payload: Mapping[str, Any]) -> Hackathon:
        if not payload:
            raise HackathonConflictError("No hackathon payload supplied")

        source_name = str(payload.get("source") or "demo-fixture")
        source_event_id = payload.get("source_event_id")
        existing = HackathonService._find_existing(db, source_name, source_event_id, payload)

        data = {
            "title": payload.get("title") or payload.get("name") or "Untitled hackathon",
            "organizer": payload.get("organizer") or "Unknown organizer",
            "description": payload.get("description") or payload.get("summary") or "No description provided.",
            "mode": payload.get("mode") or "online",
            "location": payload.get("location") or payload.get("city") or payload.get("country") or None,
            "registration_url": payload.get("registration_url") or payload.get("registrationUrl") or payload.get("source_url") or "https://example.com",
            "source": source_name,
            "source_event_id": source_event_id,
            "source_url": payload.get("source_url") or payload.get("sourceUrl") or None,
            "deadline": payload.get("deadline") or payload.get("registration_deadline") or payload.get("start_date") or datetime.utcnow(),
            "start_date": payload.get("start_date") or payload.get("startDate") or None,
            "end_date": payload.get("end_date") or payload.get("endDate") or None,
            "prize_description": payload.get("prize_description") or payload.get("prize") or None,
            "team_size_min": payload.get("team_size_min") or payload.get("team_size_minimum") or None,
            "team_size_max": payload.get("team_size_max") or payload.get("team_size_maximum") or None,
            "banner_url": payload.get("banner_url") or payload.get("image_url") or payload.get("bannerUrl") or None,
            "status": HackathonService._normalize_status(payload.get("status"), payload),
            "last_synced_at": datetime.utcnow(),
        }

        if existing is not None:
            for field, value in data.items():
                setattr(existing, field, value)
            existing.hackathon_skills.clear()
            HackathonService._sync_skills(db, existing, payload.get("skills") or [])
            db.commit()
            db.refresh(existing)
            return existing

        new_hackathon = Hackathon(**data)
        db.add(new_hackathon)
        db.flush()
        HackathonService._sync_skills(db, new_hackathon, payload.get("skills") or [])
        db.commit()
        db.refresh(new_hackathon)
        return new_hackathon

    @staticmethod
    def _find_existing(db: Session, source_name: str, source_event_id: Any, payload: Mapping[str, Any]) -> Hackathon | None:
        if source_event_id:
            return (
                db.query(Hackathon)
                .filter(Hackathon.source == source_name, Hackathon.source_event_id == str(source_event_id))
                .first()
            )

        title = (payload.get("title") or payload.get("name") or "").strip()
        organizer = (payload.get("organizer") or "").strip()
        deadline = payload.get("deadline") or payload.get("registration_deadline") or payload.get("start_date")
        if not title and not organizer:
            return None
        deadline_value = HackathonService._coerce_datetime(deadline) if deadline else None
        query = db.query(Hackathon).filter(Hackathon.source == source_name)
        if title:
            query = query.filter(func.lower(Hackathon.title) == func.lower(title))
        if organizer:
            query = query.filter(func.lower(Hackathon.organizer) == func.lower(organizer))
        if deadline_value is not None:
            query = query.filter(Hackathon.deadline == deadline_value)
        return query.first()

    @staticmethod
    def _sync_skills(db: Session, hackathon: Hackathon, skill_names: list[str] | list[int] | list[Mapping[str, Any]]) -> None:
        if not skill_names:
            return
        skills = []
        for item in skill_names:
            if isinstance(item, dict):
                name = item.get("name") or item.get("skill")
            elif isinstance(item, (int, float)):
                name = str(int(item))
            else:
                name = str(item)
            if not name:
                continue
            normalized = name.strip()
            if not normalized:
                continue
            skill = db.query(Skill).filter(func.lower(Skill.name) == func.lower(normalized)).first()
            if skill is not None and skill.id not in [s.id for s in skills]:
                skills.append(skill)
        for skill in skills:
            db.add(HackathonSkill(hackathon_id=hackathon.id, skill_id=skill.id))

    @staticmethod
    def _normalize_status(raw_status: Any, record: Mapping[str, Any]) -> str:
        status = str(raw_status or record.get("event_status") or "upcoming").strip().lower()
        mapping = {
            "upcoming": "upcoming",
            "open": "upcoming",
            "registration_open": "upcoming",
            "ongoing": "active",
            "active": "active",
            "live": "active",
            "running": "active",
            "completed": "closed",
            "ended": "closed",
            "closed": "closed",
            "cancelled": "cancelled",
            "canceled": "cancelled",
            "stale": "closed",
        }
        return mapping.get(status, "upcoming")

    @staticmethod
    def _coerce_datetime(value: Any) -> datetime | None:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return None
            try:
                return datetime.fromisoformat(text.replace("Z", "+00:00"))
            except ValueError:
                for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y"):
                    try:
                        return datetime.strptime(text, fmt)
                    except ValueError:
                        continue
        return None
