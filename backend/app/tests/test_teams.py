from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.db.session import SessionLocal
from app.main import app
from app.models import Skill, StudentProfile

client = TestClient(app)


def _register(role: str = "student") -> dict:
    suffix = uuid4().hex[:10]
    response = client.post(
        "/api/auth/register",
        json={
            "email": f"{role}-{suffix}@example.com",
            "username": f"{role}_{suffix}",
            "password": "StrongPass123!",
            "full_name": f"{role.title()} Team",
            "role": role,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def _headers(auth: dict) -> dict[str, str]:
    return {"Authorization": f"Bearer {auth['access_token']}"}


def _skill(name: str | None = None) -> Skill:
    with SessionLocal() as db:
        skill = Skill(name=name or f"Team Skill {uuid4().hex[:8]}", category="technical")
        db.add(skill)
        db.commit()
        db.refresh(skill)
        return skill


def _student_profile_id(user_id: int) -> int:
    with SessionLocal() as db:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).one()
        return profile.id


def test_student_can_create_team_with_requirements_and_owner_role() -> None:
    auth = _register()
    headers = _headers(auth)
    skill = _skill()

    created = client.post(
        "/api/teams",
        headers=headers,
        json={
            "name": "Alpha Squad",
            "description": "A project team",
            "is_public": True,
            "max_members": 3,
            "requirements": [
                {
                    "role_title": "Frontend Engineer",
                    "description": "Build UI",
                    "slots": 1,
                    "experience_level": "beginner",
                    "is_open": True,
                    "skill_ids": [skill.id],
                }
            ],
        },
    )
    assert created.status_code == 201, created.text
    team = created.json()
    assert team["name"] == "Alpha Squad"
    assert team["owner_student_id"] > 0
    assert team["members"][0]["role"] == "owner"
    assert team["requirements"][0]["role_title"] == "Frontend Engineer"
    assert team["requirements"][0]["skills"][0]["skill_id"] == skill.id


def test_team_visibility_permissions_and_owner_updates_are_enforced() -> None:
    owner = _register()
    other = _register()
    owner_headers = _headers(owner)
    other_headers = _headers(other)

    created = client.post(
        "/api/teams",
        headers=owner_headers,
        json={"name": "Hidden Team", "description": "Private", "is_public": False, "max_members": 2},
    )
    assert created.status_code == 201
    team = created.json()

    assert client.get(f"/api/teams/{team['id']}").status_code == 404
    assert client.get(f"/api/teams/{team['id']}", headers=owner_headers).status_code == 200
    assert client.patch(
        f"/api/teams/{team['id']}",
        headers=other_headers,
        json={"name": "Forbidden Name"},
    ).status_code == 409

    updated = client.patch(
        f"/api/teams/{team['id']}",
        headers=owner_headers,
        json={"name": "Visible Team", "is_public": True},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["name"] == "Visible Team"
    assert client.get(f"/api/teams/{team['id']}").status_code == 200


def test_team_invitation_acceptance_and_invalid_requirement_skills_are_handled() -> None:
    owner = _register()
    invitee = _register()
    owner_headers = _headers(owner)
    invitee_headers = _headers(invitee)
    skill = _skill()

    created = client.post(
        "/api/teams",
        headers=owner_headers,
        json={"name": "Invite Team", "max_members": 2, "requirements": [{"role_title": "Data", "slots": 1, "skill_ids": [skill.id]}]},
    )
    team_id = created.json()["id"]

    invalid_requirement = client.post(
        "/api/teams",
        headers=owner_headers,
        json={"name": "Bad Team", "requirements": [{"role_title": "Missing Skill", "slots": 1, "skill_ids": [999999]}]},
    )
    assert invalid_requirement.status_code == 404

    invite = client.post(
        f"/api/teams/{team_id}/invitations",
        headers=owner_headers,
        json={"invitee_student_id": _student_profile_id(invitee["user"]["id"])},
    )
    assert invite.status_code == 201, invite.text
    invitation = invite.json()

    assert client.patch(
        f"/api/team-invitations/{invitation['id']}",
        headers=owner_headers,
        json={"status": "accepted"},
    ).status_code == 409

    accepted = client.patch(
        f"/api/team-invitations/{invitation['id']}",
        headers=invitee_headers,
        json={"status": "accepted"},
    )
    assert accepted.status_code == 200, accepted.text
    assert accepted.json()["status"] == "accepted"

    team = client.get(f"/api/teams/{team_id}", headers=owner_headers)
    assert team.status_code == 200
    assert any(member["student_id"] == _student_profile_id(invitee["user"]["id"]) for member in team.json()["members"])
