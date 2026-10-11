from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import decode_access_token, get_bearer_token, http_bearer_scheme
from app.db.session import get_db
from app.models import User, UserRole


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(http_bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    token = get_bearer_token(credentials)
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.get(User, int(user_id))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user


async def get_optional_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(http_bearer_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User | None:
    if credentials is None:
        return None
    return await get_current_user(credentials, db)


def require_student(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student access required")
    return current_user


def require_mentor(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if current_user.role != UserRole.MENTOR:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Mentor access required")
    return current_user
