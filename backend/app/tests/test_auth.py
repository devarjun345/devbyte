from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

import jwt
import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.dependencies.auth import get_current_user, require_mentor, require_student
from app.core.config import settings
from app.core.security import create_access_token
from app.main import app
from app.models import User, UserRole

client = TestClient(app)


def _next_value(prefix: str) -> str:
    return f"{prefix}-{uuid4().hex[:8]}"


def _register_student(client: TestClient, *, email: str | None = None, username: str | None = None) -> dict:
    payload = {
        "email": email or f"student-{uuid4().hex[:8]}@example.com",
        "username": username or f"student_{uuid4().hex[:8]}",
        "password": "StrongPass123!",
        "full_name": "Student Account",
        "role": "student",
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201, response.text
    return payload, response.json()


def test_student_registration_succeeds_and_hashes_password() -> None:
    payload, data = _register_student(client)

    assert data["user"]["email"] == payload["email"].lower()
    assert data["user"]["role"] == "student"
    assert "password" not in data["user"]
    assert data["access_token"]

    user = User.__table__
    assert user is not None

    from app.db.session import SessionLocal

    with SessionLocal() as db:
        saved = db.query(User).filter(User.email == payload["email"].lower()).one()
        assert saved.password_hash != payload["password"]
        assert saved.password_hash.startswith("$")
        assert saved.role == UserRole.STUDENT


def test_mentor_registration_succeeds() -> None:
    payload = {
        "email": f"mentor-{uuid4().hex[:8]}@example.com",
        "username": f"mentor_{uuid4().hex[:8]}",
        "password": "StrongPass456!",
        "full_name": "Mentor Account",
        "role": "mentor",
    }

    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201, response.text
    body = response.json()
    assert body["user"]["role"] == "mentor"
    assert body["user"]["full_name"] == "Mentor Account"


def test_duplicate_email_and_username_are_rejected() -> None:
    payload = {
        "email": f"dup-{uuid4().hex[:8]}@example.com",
        "username": f"dup_{uuid4().hex[:8]}",
        "password": "StrongPass789!",
        "full_name": "Dup User",
        "role": "student",
    }

    first = client.post("/api/auth/register", json=payload)
    assert first.status_code == 201

    duplicate_email = {**payload, "username": f"newuser_{uuid4().hex[:8]}"}
    response = client.post("/api/auth/register", json=duplicate_email)
    assert response.status_code == 409

    duplicate_username = {**payload, "email": f"other-{uuid4().hex[:8]}@example.com"}
    response = client.post("/api/auth/register", json=duplicate_username)
    assert response.status_code == 409


def test_invalid_registration_is_rejected() -> None:
    response = client.post(
        "/api/auth/register",
        json={
            "email": "bad-email",
            "username": "ab",
            "password": "short",
            "full_name": "",
            "role": "student",
        },
    )
    assert response.status_code == 422


def test_login_accepts_valid_credentials_and_rejects_invalid() -> None:
    payload, _ = _register_student(client)

    login_response = client.post(
        "/api/auth/login",
        json={"identifier": payload["email"], "password": payload["password"]},
    )
    assert login_response.status_code == 200, login_response.text
    data = login_response.json()
    assert data["user"]["email"] == payload["email"].lower()
    assert data["access_token"]

    bad_login = client.post(
        "/api/auth/login",
        json={"identifier": payload["email"], "password": "WrongPassword!"},
    )
    assert bad_login.status_code == 401

    missing_user = client.post(
        "/api/auth/login",
        json={"identifier": "missing@example.com", "password": "WrongPassword!"},
    )
    assert missing_user.status_code == 401


def test_current_user_requires_valid_token() -> None:
    payload, register_body = _register_student(client)
    login_response = client.post(
        "/api/auth/login",
        json={"identifier": payload["email"], "password": payload["password"]},
    )
    token = login_response.json()["access_token"]

    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == payload["email"].lower()

    no_token = client.get("/api/auth/me")
    assert no_token.status_code == 401

    invalid = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid-token"})
    assert invalid.status_code == 401

    expired_payload = {"sub": "9999", "role": "student", "exp": 0, "iat": 0}
    expired_token = jwt.encode(expired_payload, settings.jwt_secret, algorithm="HS256")
    expired = client.get("/api/auth/me", headers={"Authorization": f"Bearer {expired_token}"})
    assert expired.status_code == 401


def test_authorization_requirements_are_enforced() -> None:
    student_payload = {
        "email": f"role-student-{uuid4().hex[:8]}@example.com",
        "username": f"role_student_{uuid4().hex[:8]}",
        "password": "StrongPass123!",
        "full_name": "Student Role User",
        "role": "student",
    }
    mentor_payload = {
        "email": f"role-mentor-{uuid4().hex[:8]}@example.com",
        "username": f"role_mentor_{uuid4().hex[:8]}",
        "password": "StrongPass456!",
        "full_name": "Mentor Role User",
        "role": "mentor",
    }

    student = client.post("/api/auth/register", json=student_payload)
    mentor = client.post("/api/auth/register", json=mentor_payload)
    assert student.status_code == 201
    assert mentor.status_code == 201

    student_token = client.post(
        "/api/auth/login",
        json={"identifier": student_payload["email"], "password": student_payload["password"]},
    ).json()["access_token"]
    mentor_token = client.post(
        "/api/auth/login",
        json={"identifier": mentor_payload["email"], "password": mentor_payload["password"]},
    ).json()["access_token"]

    from app.db.session import SessionLocal

    with SessionLocal() as db:
        student_user = db.query(User).filter(User.email == student_payload["email"].lower()).one()
        mentor_user = db.query(User).filter(User.email == mentor_payload["email"].lower()).one()

        assert require_student(student_user) is student_user
        with pytest.raises(HTTPException):
            require_student(mentor_user)

        assert require_mentor(mentor_user) is mentor_user
        with pytest.raises(HTTPException):
            require_mentor(student_user)

    student_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {student_token}"})
    mentor_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {mentor_token}"})
    assert student_me.status_code == 200
    assert mentor_me.status_code == 200
    assert student_me.json()["role"] == "student"
    assert mentor_me.json()["role"] == "mentor"


def test_logout_returns_success_for_authenticated_user() -> None:
    payload, _ = _register_student(client)
    login_response = client.post(
        "/api/auth/login",
        json={"identifier": payload["email"], "password": payload["password"]},
    )
    token = login_response.json()["access_token"]

    response = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["message"] == "Logout successful"

    unauthenticated = client.post("/api/auth/logout")
    assert unauthenticated.status_code == 401

