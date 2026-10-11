from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models import MentorProfile, StudentProfile, User, UserRole
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    @staticmethod
    def register_user(db: Session, data: RegisterRequest) -> User:
        email_exists = db.query(User).filter(User.email == data.email.lower()).first()
        username_exists = db.query(User).filter(User.username == data.username).first()
        if email_exists:
            raise ValueError("Email already registered")
        if username_exists:
            raise ValueError("Username already taken")

        role = UserRole(data.role)
        user = User(
            email=data.email.lower(),
            username=data.username,
            password_hash=hash_password(data.password),
            role=role,
            is_active=True,
            is_verified=False,
        )
        db.add(user)
        db.flush()

        if role == UserRole.STUDENT:
            profile = StudentProfile(user_id=user.id, full_name=data.full_name, bio=data.bio)
        else:
            profile = MentorProfile(user_id=user.id, full_name=data.full_name, bio=data.bio)

        db.add(profile)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, data: LoginRequest) -> tuple[User, str]:
        user = db.query(User).filter(
            (User.email == data.identifier.lower()) | (User.username == data.identifier)
        ).first()
        if user is None or not verify_password(data.password, user.password_hash):
            raise ValueError("Invalid credentials")
        if not user.is_active:
            raise ValueError("User is inactive")

        token = create_access_token(user.id, role=user.role.value)
        return user, token
