from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas.auth import AuthResponse, LoginRequest, RegisterRequest, TokenResponse, UserPublic
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: RegisterRequest, db: Annotated[Session, Depends(get_db)]) -> AuthResponse:
    try:
        user = AuthService.register_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc

    token = user.get_auth_token() if hasattr(user, "get_auth_token") else None
    if token is None:
        from app.core.security import create_access_token

        token = create_access_token(user.id, role=user.role.value)

    profile_name = None
    if user.student_profile:
        profile_name = user.student_profile.full_name
    elif user.mentor_profile:
        profile_name = user.mentor_profile.full_name

    public_user = UserPublic(
        id=user.id,
        email=user.email,
        username=user.username,
        role=user.role.value,
        is_active=user.is_active,
        is_verified=user.is_verified,
        full_name=profile_name,
    )
    return AuthResponse(access_token=token, token_type="bearer", user=public_user)


@router.post("/login", response_model=AuthResponse)
def login_user(payload: LoginRequest, db: Annotated[Session, Depends(get_db)]) -> AuthResponse:
    try:
        user, token = AuthService.authenticate_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc

    profile_name = None
    if user.student_profile:
        profile_name = user.student_profile.full_name
    elif user.mentor_profile:
        profile_name = user.mentor_profile.full_name

    public_user = UserPublic(
        id=user.id,
        email=user.email,
        username=user.username,
        role=user.role.value,
        is_active=user.is_active,
        is_verified=user.is_verified,
        full_name=profile_name,
    )
    return AuthResponse(access_token=token, token_type="bearer", user=public_user)


@router.post("/logout", response_model=dict[str, str])
def logout_user(current_user: Annotated[User, Depends(get_current_user)]) -> dict[str, str]:
    _ = current_user
    return {"message": "Logout successful"}


@router.get("/me", response_model=UserPublic)
def get_current_user_profile(current_user: Annotated[User, Depends(get_current_user)]) -> UserPublic:
    profile_name = None
    if current_user.student_profile:
        profile_name = current_user.student_profile.full_name
    elif current_user.mentor_profile:
        profile_name = current_user.mentor_profile.full_name

    return UserPublic(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        role=current_user.role.value,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        full_name=profile_name,
    )
