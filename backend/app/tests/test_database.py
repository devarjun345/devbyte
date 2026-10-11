from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text

from app import models  # noqa: F401
from app.core.config import settings
from app.db.base import Base


def _engine():
    return create_engine(settings.database_url, pool_pre_ping=True, future=True)


def test_database_configuration_loads() -> None:
    assert settings.database_url.startswith("mysql+pymysql://")
    assert "localhost" in settings.database_url
    assert settings.database_url.endswith("/devrank")


def test_database_connection_works() -> None:
    with _engine().connect() as connection:
        result = connection.execute(text("SELECT 1 AS ok")).scalar_one()
        assert result == 1


def test_sqlalchemy_metadata_contains_core_tables() -> None:
    required_tables = {
        "users",
        "student_profiles",
        "mentor_profiles",
        "skills",
        "student_skills",
        "projects",
        "teams",
        "hackathons",
        "skill_swap_requests",
        "contests",
        "submissions",
        "mentor_session_offerings",
        "assignments",
        "ai_conversations",
    }

    assert required_tables.issubset(set(Base.metadata.tables))


def test_database_schema_has_expected_unique_constraints() -> None:
    inspector = inspect(_engine())

    user_unique = {constraint["column_names"][0] for constraint in inspector.get_unique_constraints("users")}
    assert {"email", "username"}.issubset(user_unique)

    student_skill_unique = inspector.get_unique_constraints("student_skills")
    assert any(
        set(constraint["column_names"]) == {"student_id", "skill_id"}
        for constraint in student_skill_unique
    )

    assignment_unique = inspector.get_unique_constraints("assignment_recipients")
    assert any(
        set(constraint["column_names"]) == {"assignment_id", "student_id"}
        for constraint in assignment_unique
    )


def test_alembic_upgrade_from_head_succeeds() -> None:
    config = Config(str(Path(__file__).resolve().parents[2] / "alembic.ini"))
    command.upgrade(config, "head")

    with _engine().connect() as connection:
        result = connection.execute(text("SHOW TABLES LIKE 'users'"))
        assert result.fetchone() is not None
