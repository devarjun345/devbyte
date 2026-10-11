from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import require_student
from app.db.session import get_db
from app.models import User
from app.schemas.skills import (
    LearningGoalCreate,
    LearningGoalResponse,
    SkillResponse,
    StudentSkillCreate,
    StudentSkillResponse,
    StudentSkillUpdate,
)
from app.services.skill_service import (
    SkillConflictError,
    SkillNotFoundError,
    SkillService,
)

router = APIRouter()


@router.get("/skills", response_model=list[SkillResponse])
def list_skills(
    db: Annotated[Session, Depends(get_db)],
    search: str | None = Query(default=None, min_length=1),
    category: str | None = Query(default=None, min_length=1),
) -> list[SkillResponse]:
    return [SkillResponse.model_validate(skill, from_attributes=True) for skill in SkillService.list_skills(db, search, category)]


@router.get("/students/me/skills", response_model=list[StudentSkillResponse])
def list_my_skills(
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentSkillResponse]:
    student = _student_profile(current_user)
    return [_student_skill_response(item) for item in SkillService.list_student_skills(db, student)]


@router.post("/students/me/skills", response_model=StudentSkillResponse, status_code=status.HTTP_201_CREATED)
def add_my_skill(
    payload: StudentSkillCreate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentSkillResponse:
    try:
        item = SkillService.add_student_skill(db, _student_profile(current_user), payload.model_dump())
    except SkillNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except SkillConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return _student_skill_response(item)


@router.patch("/students/me/skills/{skill_id}", response_model=StudentSkillResponse)
def update_my_skill(
    skill_id: int,
    payload: StudentSkillUpdate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentSkillResponse:
    try:
        item = SkillService.update_student_skill(
            db,
            _student_profile(current_user),
            skill_id,
            payload.model_dump(exclude_unset=True),
        )
    except SkillNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return _student_skill_response(item)


@router.delete(
    "/students/me/skills/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    response_model=None,
)
def remove_my_skill(
    skill_id: int,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    try:
        SkillService.remove_student_skill(db, _student_profile(current_user), skill_id)
    except SkillNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.get("/students/me/learning-goals", response_model=list[LearningGoalResponse])
def list_my_learning_goals(
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[LearningGoalResponse]:
    student = _student_profile(current_user)
    return [_learning_goal_response(item) for item in SkillService.list_learning_goals(db, student)]


@router.post("/students/me/learning-goals", response_model=LearningGoalResponse, status_code=status.HTTP_201_CREATED)
def add_my_learning_goal(
    payload: LearningGoalCreate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> LearningGoalResponse:
    try:
        goal = SkillService.add_learning_goal(db, _student_profile(current_user), payload.model_dump())
    except SkillNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except SkillConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return _learning_goal_response(goal)


@router.delete(
    "/students/me/learning-goals/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=Response,
    response_model=None,
)
def remove_my_learning_goal(
    goal_id: int,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> None:
    try:
        SkillService.remove_learning_goal(db, _student_profile(current_user), goal_id)
    except SkillNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


def _student_profile(user: User):
    if user.student_profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")
    return user.student_profile


def _student_skill_response(item) -> StudentSkillResponse:
    return StudentSkillResponse(
        id=item.id,
        skill=SkillResponse(id=item.skill.id, name=item.skill.name, category=item.skill.category),
        proficiency=item.proficiency.value,
        can_teach=item.can_teach,
        years_experience=item.years_experience,
    )


def _learning_goal_response(item) -> LearningGoalResponse:
    return LearningGoalResponse(
        id=item.id,
        skill=SkillResponse(id=item.skill.id, name=item.skill.name, category=item.skill.category),
        current_proficiency=item.current_proficiency.value,
        target_proficiency=item.target_proficiency.value,
    )
