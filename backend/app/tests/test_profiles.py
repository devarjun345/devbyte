from __future__ import annotations

from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _register(role: str) -> tuple[dict, str]:
    payload = {
        "email": f"{role}-{uuid4().hex[:10]}@example.com",
        "username": f"{role}_{uuid4().hex[:10]}",
        "password": "StrongPass123!",
        "full_name": f"{role.title()} Profile",
        "role": role,
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201, response.text
    return response.json(), payload


def test_student_can_access_update_and_persist_own_profile() -> None:
    auth, payload = _register("student")
    headers = {"Authorization": f"Bearer {auth['access_token']}"}

    profile = client.get("/api/students/me", headers=headers)
    assert profile.status_code == 200
    profile_data = profile.json()
    assert profile_data["username"] == payload["username"]
    assert "email" not in profile_data
    assert "password_hash" not in profile_data

    update = client.patch(
        "/api/students/me",
        headers=headers,
        json={
            "full_name": "Updated Student",
            "college": "DEV BYTE University",
            "branch": "Computer Science",
            "year": 3,
            "github_url": "https://github.com/devbyte/student",
        },
    )
    assert update.status_code == 200, update.text
    assert update.json()["full_name"] == "Updated Student"
    assert update.json()["college"] == "DEV BYTE University"

    persisted = client.get("/api/students/me", headers=headers)
    assert persisted.json()["branch"] == "Computer Science"
    assert persisted.json()["year"] == 3


def test_mentor_can_access_update_and_persist_own_profile() -> None:
    auth, payload = _register("mentor")
    headers = {"Authorization": f"Bearer {auth['access_token']}"}

    profile = client.get("/api/mentors/me", headers=headers)
    assert profile.status_code == 200
    assert profile.json()["username"] == payload["username"]

    update = client.patch(
        "/api/mentors/me",
        headers=headers,
        json={
            "full_name": "Updated Mentor",
            "organization": "DEV BYTE Labs",
            "experience_years": 8.5,
            "website_url": "https://devbyte.example.com",
        },
    )
    assert update.status_code == 200, update.text
    assert update.json()["full_name"] == "Updated Mentor"
    assert str(update.json()["experience_years"]) == "8.5"

    persisted = client.get("/api/mentors/me", headers=headers)
    assert persisted.json()["organization"] == "DEV BYTE Labs"


def test_profiles_require_authentication_and_correct_role() -> None:
    assert client.get("/api/students/me").status_code == 401
    assert client.patch("/api/students/me", json={"full_name": "Nope"}).status_code == 401
    assert client.get("/api/mentors/me").status_code == 401

    student, _ = _register("student")
    mentor, _ = _register("mentor")
    student_headers = {"Authorization": f"Bearer {student['access_token']}"}
    mentor_headers = {"Authorization": f"Bearer {mentor['access_token']}"}

    assert client.get("/api/mentors/me", headers=student_headers).status_code == 403
    assert client.patch("/api/mentors/me", headers=student_headers, json={"full_name": "Nope"}).status_code == 403
    assert client.get("/api/students/me", headers=mentor_headers).status_code == 403
    assert client.patch("/api/students/me", headers=mentor_headers, json={"full_name": "Nope"}).status_code == 403


def test_public_profile_lookup_and_lists_exclude_sensitive_fields() -> None:
    student, _ = _register("student")
    mentor, _ = _register("mentor")
    student_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {student['access_token']}"}).json()
    mentor_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {mentor['access_token']}"}).json()

    student_profile = client.get("/api/students/me", headers={"Authorization": f"Bearer {student['access_token']}"}).json()
    mentor_profile = client.get("/api/mentors/me", headers={"Authorization": f"Bearer {mentor['access_token']}"}).json()

    public_student = client.get(f"/api/students/{student_profile['id']}")
    public_mentor = client.get(f"/api/mentors/{mentor_profile['id']}")
    assert public_student.status_code == 200
    assert public_mentor.status_code == 200
    assert public_student.json()["user_id"] == student_me["id"]
    assert public_mentor.json()["user_id"] == mentor_me["id"]
    for body in (public_student.json(), public_mentor.json()):
        assert "email" not in body
        assert "password" not in body
        assert "password_hash" not in body
        assert "access_token" not in body

    students = client.get("/api/students")
    mentors = client.get("/api/mentors")
    assert students.status_code == 200
    assert mentors.status_code == 200
    assert any(item["id"] == student_profile["id"] for item in students.json())
    assert any(item["id"] == mentor_profile["id"] for item in mentors.json())


def test_invalid_profile_data_and_profile_modification_routes_are_rejected() -> None:
    student, _ = _register("student")
    headers = {"Authorization": f"Bearer {student['access_token']}"}

    invalid = client.patch(
        "/api/students/me",
        headers=headers,
        json={"year": 0, "github_url": "not-a-url"},
    )
    assert invalid.status_code == 422

    profile = client.get("/api/students/me", headers=headers).json()
    assert client.patch(f"/api/students/{profile['id']}", headers=headers, json={"full_name": "Nope"}).status_code == 405


def test_missing_public_profile_returns_not_found() -> None:
    assert client.get("/api/students/999999999").status_code == 404
    assert client.get("/api/mentors/999999999").status_code == 404
