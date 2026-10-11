from __future__ import annotations

import logging
from collections.abc import Sequence
from datetime import datetime, timedelta, timezone

logger = logging.getLogger(__name__)


class SourceDecisionError(RuntimeError):
    pass


class DemoHackathonAdapter:
    """Safe local demo source used only for deterministic API validation and testing.

    This project does not include a documented, legally-permitted public hackathon feed.
    The adapter intentionally avoids scraping any public site without explicit permission,
    and keeps all data in a local fixture so source failures do not take down the API.
    """

    source_name = "demo-fixture"

    def fetch(self) -> list[dict]:
        now = datetime.now(timezone.utc)
        return [
            {
                "source": self.source_name,
                "source_event_id": "demo-001",
                "title": "AI Builders Sprint",
                "organizer": "DEV BYTE Demo Labs",
                "description": "A student-focused challenge for building GenAI products in 48 hours.",
                "mode": "online",
                "location": "Remote",
                "registration_url": "https://example.com/register/ai-builders",
                "source_url": "https://example.com/hackathons/ai-builders",
                "deadline": (now + timedelta(days=12)).strftime("%Y-%m-%dT23:59:59+00:00"),
                "start_date": (now + timedelta(days=15)).strftime("%Y-%m-%dT18:00:00+00:00"),
                "end_date": (now + timedelta(days=17)).strftime("%Y-%m-%dT18:00:00+00:00"),
                "prize_description": "Cash prizes and internship interviews",
                "team_size_min": 2,
                "team_size_max": 4,
                "banner_url": "https://example.com/images/ai-builders.jpg",
                "status": "upcoming",
                "skills": ["python", "machine learning", "web development"],
            },
            {
                "source": self.source_name,
                "source_event_id": "demo-002",
                "title": "Climate Tech Challenge",
                "organizer": "Green Innovation Guild",
                "description": "Build sustainable solutions for climate resilience.",
                "mode": "hybrid",
                "location": "Bengaluru, India",
                "registration_url": "https://example.com/register/climate-tech",
                "source_url": "https://example.com/hackathons/climate-tech",
                "deadline": (now + timedelta(days=8)).strftime("%Y-%m-%dT20:00:00+05:30"),
                "start_date": (now + timedelta(days=20)).strftime("%Y-%m-%dT09:00:00+05:30"),
                "end_date": (now + timedelta(days=22)).strftime("%Y-%m-%dT18:00:00+05:30"),
                "prize_description": "Seed funding and mentorship",
                "team_size_min": 3,
                "team_size_max": 5,
                "banner_url": "https://example.com/images/climate-tech.jpg",
                "status": "upcoming",
                "skills": ["ai", "python", "sustainability"],
            },
        ]


class HackathonIngestionService:
    def __init__(self, adapter: DemoHackathonAdapter | None = None) -> None:
        self.adapter = adapter or DemoHackathonAdapter()

    def sync(self, db, *, source_name: str | None = None) -> dict:
        source = source_name or self.adapter.source_name
        result = {"source": source, "inserted": 0, "updated": 0, "skipped": 0, "errors": []}
        try:
            records = self.adapter.fetch()
        except Exception as exc:  # pragma: no cover - safety path
            logger.warning("Hackathon source %s fetch failed: %s", source, exc)
            result["errors"].append({"source": source, "error": str(exc)})
            return result

        for record in records:
            try:
                # Explicitly keep all external parsing isolated to the adapter/service layer.
                from app.services.hackathon_service import HackathonService

                normalized = dict(record)
                normalized["source"] = source
                if "skills" in normalized and isinstance(normalized["skills"], Sequence) and not isinstance(normalized["skills"], (str, bytes)):
                    normalized["skills"] = [str(v) for v in normalized["skills"]]
                existing = HackathonService._find_existing(db, source, normalized.get("source_event_id"), normalized)
                if existing is not None:
                    HackathonService.upsert_record(db, normalized)
                    result["updated"] += 1
                    continue
                HackathonService.upsert_record(db, normalized)
                result["inserted"] += 1
            except Exception as exc:  # pragma: no cover - safety path
                logger.warning("Skipping invalid hackathon record from %s: %s", source, exc)
                result["errors"].append({"source": source, "error": str(exc), "record": record})
                result["skipped"] += 1
        return result
