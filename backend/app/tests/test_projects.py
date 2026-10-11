from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.db.session import SessionLocal
from app.main import app
from app.models import Skill

client = TestClient(app)


def _register(role: str = "student") -> dict:
    suffix = uuid4().hex[:10]
    response = client.post(
        "/api/auth/register",
        json={
            "email": f"{role}-{suffix}@example.com",
            "username": f"{role}_{suffix}",
            "password": "StrongPass123!",
            "full_name": f"{role.title()} Projects",
            "role": role,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def _skill() -> Skill:
    with SessionLocal() as db:
        skill = Skill(name=f"Project Skill {uuid4().hex[:8]}", category="language")
        db.add(skill)
        db.commit()
        db.refresh(skill)
        return skill


def _headers(auth: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {auth['access_token']}"}


def test_student_can_create_update_list_and_delete_project_with_skills() -> None:
    auth = _register()
    headers = _headers(auth)
    skill = _skill()

    created = client.post(
        "/api/projects",
        headers=headers,
        json={
            "title": "Portfolio Builder",
            "description": "A project portfolio for students.",
            "category": "education",
            "github_url": "https://github.com/devbyte/portfolio",
            "skill_ids": [skill.id],
        },
    )
    assert created.status_code == 201, created.text
    project = created.json()
    assert project["owner_student_id"] > 0
    assert project["status"] == "in_progress"
    assert project["skills"][0]["id"] == skill.id
    assert project["members"][0]["role"] == "owner"

    listed = client.get("/api/projects/me", headers=headers)
    assert listed.status_code == 200
    assert listed.json()[0]["id"] == project["id"]

    updated = client.patch(
        f"/api/projects/{project['id']}",
        headers=headers,
        json={"status": "completed", "is_public": False, "skill_ids": []},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["status"] == "completed"
    assert updated.json()["skills"] == []

    assert client.delete(f"/api/projects/{project['id']}", headers=headers).status_code == 204
    assert client.get(f"/api/projects/{project['id']}").status_code == 404


def test_public_and_private_project_visibility_is_enforced() -> None:
    auth = _register()
    headers = _headers(auth)
    public_project = client.post(
        "/api/projects",
        headers=headers,
        json={"title": "Public", "description": "Visible project.", "is_public": True},
    ).json()
    private_project = client.post(
        "/api/projects",
        headers=headers,
        json={"title": "Private", "description": "Private project.", "is_public": False},
    ).json()

    assert client.get(f"/api/projects/{public_project['id']}").status_code == 200
    assert client.get(f"/api/projects/{private_project['id']}").status_code == 404
    assert client.get(f"/api/projects/{private_project['id']}", headers=headers).status_code == 200


def test_project_ownership_authentication_and_validation_are_enforced() -> None:
    owner = _register()
    other = _register()
    owner_headers = _headers(owner)
    other_headers = _headers(other)
    project = client.post(
        "/api/projects",
        headers=owner_headers,
        json={"title": "Owned", "description": "Owner only.", "is_public": True},
    ).json()

    assert client.post("/api/projects", json={"title": "No auth", "description": "Rejected"}).status_code == 401
    assert client.patch(
        f"/api/projects/{project['id']}",
        headers=other_headers,
        json={"title": "Unauthorized"},
    ).status_code == 404
    assert client.delete(f"/api/projects/{project['id']}", headers=other_headers).status_code == 404
    assert client.post(
        "/api/projects",
        headers=owner_headers,
        json={"title": "", "description": "Invalid"},
    ).status_code == 422
    assert client.patch(
        f"/api/projects/{project['id']}",
        headers=owner_headers,
        json={"status": "unknown"},
    ).status_code == 422


def test_invalid_and_duplicate_project_skills_are_rejected() -> None:
    auth = _register()
    headers = _headers(auth)
    skill = _skill()
    duplicate = client.post(
        "/api/projects",
        headers=headers,
        json={
            "title": "Duplicate Skills",
            "description": "Should fail.",
            "skill_ids": [skill.id, skill.id],
        },
    )
    assert duplicate.status_code == 409
    missing = client.post(
        "/api/projects",
        headers=headers,
        json={"title": "Missing Skill", "description": "Should fail.", "skill_ids": [999999999]},
    )
    assert missing.status_code == 404
