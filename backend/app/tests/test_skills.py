from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.db.session import SessionLocal
from app.main import app
from app.models import Skill
from app.services.skill_service import canonical_skill_name

client = TestClient(app)


def _register(role: str) -> tuple[dict, dict]:
    payload = {
        "email": f"{role}-{uuid4().hex[:10]}@example.com",
        "username": f"{role}_{uuid4().hex[:10]}",
        "password": "StrongPass123!",
        "full_name": f"{role.title()} Skills",
        "role": role,
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201, response.text
    return response.json(), payload


def _skill(name: str | None = None, category: str = "language") -> Skill:
    skill = Skill(name=name or f"Skill {uuid4().hex[:8]}", category=category)
    with SessionLocal() as db:
        db.add(skill)
        db.commit()
        db.refresh(skill)
        return skill


def test_skill_catalogue_supports_search_and_category_filtering() -> None:
    skill = _skill(category="framework")
    assert client.get("/api/skills", params={"search": skill.name}).json()[0]["name"] == skill.name
    filtered = client.get("/api/skills", params={"category": "framework"})
    assert filtered.status_code == 200
    assert any(item["id"] == skill.id for item in filtered.json())


def test_student_can_manage_skills_and_learning_goals() -> None:
    auth, _ = _register("student")
    headers = {"Authorization": f"Bearer {auth['access_token']}"}
    skill = _skill()

    created = client.post(
        "/api/students/me/skills",
        headers=headers,
        json={"skill_id": skill.id, "proficiency": "beginner", "can_teach": True, "years_experience": 1.5},
    )
    assert created.status_code == 201, created.text
    assert created.json()["skill"]["id"] == skill.id
    student_skill_id = created.json()["id"]

    updated = client.patch(
        f"/api/students/me/skills/{student_skill_id}",
        headers=headers,
        json={"proficiency": "advanced", "years_experience": 3},
    )
    assert updated.status_code == 200
    assert updated.json()["proficiency"] == "advanced"

    goal = client.post(
        "/api/students/me/learning-goals",
        headers=headers,
        json={"skill_id": skill.id, "current_proficiency": "beginner", "target_proficiency": "advanced"},
    )
    assert goal.status_code == 201, goal.text
    assert client.get("/api/students/me/skills", headers=headers).json()[0]["id"] == student_skill_id
    assert client.get("/api/students/me/learning-goals", headers=headers).json()[0]["id"] == goal.json()["id"]
    assert client.delete(f"/api/students/me/learning-goals/{goal.json()['id']}", headers=headers).status_code == 204
    assert client.delete(f"/api/students/me/skills/{student_skill_id}", headers=headers).status_code == 204


def test_skill_ownership_role_and_duplicates_are_enforced() -> None:
    first, _ = _register("student")
    second, _ = _register("student")
    mentor, _ = _register("mentor")
    first_headers = {"Authorization": f"Bearer {first['access_token']}"}
    second_headers = {"Authorization": f"Bearer {second['access_token']}"}
    mentor_headers = {"Authorization": f"Bearer {mentor['access_token']}"}
    skill = _skill()
    payload = {"skill_id": skill.id, "proficiency": "intermediate"}

    created = client.post("/api/students/me/skills", headers=first_headers, json=payload)
    assert created.status_code == 201
    assert client.post("/api/students/me/skills", headers=first_headers, json=payload).status_code == 409
    assert client.patch(
        f"/api/students/me/skills/{created.json()['id']}",
        headers=second_headers,
        json={"can_teach": True},
    ).status_code == 404
    assert client.post("/api/students/me/skills", headers=mentor_headers, json=payload).status_code == 403
    assert client.get("/api/students/me/skills").status_code == 401


def test_skill_validation_and_canonical_name_normalization() -> None:
    assert canonical_skill_name("  PYTHON   ") == "python"
    skill = _skill()
    auth, _ = _register("student")
    headers = {"Authorization": f"Bearer {auth['access_token']}"}
    invalid = client.post(
        "/api/students/me/skills",
        headers=headers,
        json={"skill_id": skill.id, "proficiency": "expert", "years_experience": -1},
    )
    assert invalid.status_code == 422
    missing = client.post(
        "/api/students/me/skills",
        headers=headers,
        json={"skill_id": 999999999, "proficiency": "beginner"},
    )
    assert missing.status_code == 404
