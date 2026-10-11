from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_optional_current_user, require_student
from app.db.session import get_db
from app.models import User
from app.schemas.projects import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.project_service import (
    ProjectConflictError,
    ProjectNotFoundError,
    ProjectService,
)

router = APIRouter()


@router.get("/projects/me", response_model=list[ProjectResponse])
def list_my_projects(
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[ProjectResponse]:
    student = _student_profile(current_user)
    return [_project_response(project) for project in ProjectService.list_owned(db, student)]


@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> ProjectResponse:
    try:
        project = ProjectService.create(db, _student_profile(current_user), _values(payload))
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ProjectConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return _project_response(project)


@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    current_user: Annotated[User | None, Depends(get_optional_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> ProjectResponse:
    student = current_user.student_profile if current_user and current_user.student_profile else None
    try:
        project = ProjectService.get_public_or_owned(db, project_id, student)
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return _project_response(project)


@router.patch("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> ProjectResponse:
    try:
        project = ProjectService.update(db, _student_profile(current_user), project_id, _values(payload))
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ProjectConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return _project_response(project)


@router.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    response_model=None,
)
def delete_project(
    project_id: int,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    try:
        ProjectService.delete(db, _student_profile(current_user), project_id)
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


def _student_profile(user: User):
    if user.student_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return user.student_profile


def _values(payload: ProjectCreate | ProjectUpdate) -> dict:
    values = payload.model_dump(exclude_unset=True)
    for field in ("github_url", "demo_url", "image_url"):
        if values.get(field) is not None:
            values[field] = str(values[field])
    if "status" in values:
        values["status"] = values["status"].value
    return values


def _project_response(project) -> ProjectResponse:
    return ProjectResponse(
        id=project.id,
        owner_student_id=project.owner_student_id,
        team_id=project.team_id,
        title=project.title,
        description=project.description,
        category=project.category,
        status=project.status.value,
        github_url=project.github_url,
        demo_url=project.demo_url,
        image_url=project.image_url,
        is_public=project.is_public,
        owner_username=project.owner_student.user.username,
        owner_full_name=project.owner_student.full_name,
        skills=[
            {"id": item.skill.id, "name": item.skill.name, "category": item.skill.category}
            for item in project.project_skills
        ],
        members=[
            {
                "student_id": item.student_id,
                "username": item.student.user.username,
                "role": item.role,
            }
            for item in project.members
        ],
    )
