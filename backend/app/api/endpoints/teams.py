from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_optional_current_user, require_student
from app.db.session import get_db
from app.models import TeamInvitationStatus, User
from app.schemas.teams import (
    TeamCreate,
    TeamInvitationCreate,
    TeamInvitationDecision,
    TeamInvitationResponse,
    TeamResponse,
    TeamUpdate,
)
from app.services.team_service import TeamConflictError, TeamNotFoundError, TeamService

router = APIRouter()


@router.get("/teams", response_model=list[TeamResponse])
def list_teams(
    current_user: Annotated[User | None, Depends(get_optional_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[TeamResponse]:
    student = current_user.student_profile if current_user and current_user.student_profile else None
    return [_team_response(team) for team in TeamService.list_visible(db, student)]


@router.post("/teams", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    payload: TeamCreate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> TeamResponse:
    try:
        team = TeamService.create(db, current_user.student_profile, _team_values(payload))
    except TeamNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except TeamConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return _team_response(team)


@router.get("/teams/{team_id}", response_model=TeamResponse)
def get_team(
    team_id: int,
    current_user: Annotated[User | None, Depends(get_optional_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> TeamResponse:
    student = current_user.student_profile if current_user and current_user.student_profile else None
    try:
        team = TeamService.get(db, team_id, student)
    except TeamNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return _team_response(team)


@router.patch("/teams/{team_id}", response_model=TeamResponse)
def update_team(
    team_id: int,
    payload: TeamUpdate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> TeamResponse:
    try:
        team = TeamService.update(db, current_user.student_profile, team_id, _team_values(payload))
    except TeamNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except TeamConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return _team_response(team)


@router.post("/teams/{team_id}/invitations", response_model=TeamInvitationResponse, status_code=status.HTTP_201_CREATED)
def invite_member(
    team_id: int,
    payload: TeamInvitationCreate,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> TeamInvitationResponse:
    try:
        invitation = TeamService.create_invitation(db, current_user.student_profile, team_id, payload.model_dump(exclude_unset=True))
    except TeamNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except TeamConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return TeamInvitationResponse(
        id=invitation.id,
        team_id=invitation.team_id,
        inviter_student_id=invitation.inviter_student_id,
        invitee_student_id=invitation.invitee_student_id,
        status=invitation.status.value,
        message=invitation.message,
    )


@router.patch("/team-invitations/{invitation_id}", response_model=TeamInvitationResponse)
def respond_to_invitation(
    invitation_id: int,
    payload: TeamInvitationDecision,
    current_user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> TeamInvitationResponse:
    try:
        invitation = TeamService.respond_to_invitation(db, current_user.student_profile, invitation_id, payload.status)
    except TeamNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except TeamConflictError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    return TeamInvitationResponse(
        id=invitation.id,
        team_id=invitation.team_id,
        inviter_student_id=invitation.inviter_student_id,
        invitee_student_id=invitation.invitee_student_id,
        status=invitation.status.value,
        message=invitation.message,
    )


def _team_values(payload: TeamCreate | TeamUpdate) -> dict:
    values = payload.model_dump(exclude_unset=True)
    if "requirements" in values:
        reqs = []
        for req in values["requirements"]:
            if isinstance(req, dict):
                req = dict(req)
                if req.get("experience_level") is not None:
                    req["experience_level"] = getattr(req["experience_level"], "value", req["experience_level"])
                reqs.append(req)
            else:
                item = req.model_dump(exclude_unset=True)
                if item.get("experience_level") is not None:
                    item["experience_level"] = getattr(item["experience_level"], "value", item["experience_level"])
                reqs.append(item)
        values["requirements"] = reqs
    return values


def _team_response(team) -> TeamResponse:
    return TeamResponse(
        id=team.id,
        name=team.name,
        description=team.description,
        owner_student_id=team.owner_student_id,
        owner_username=team.owner_student.user.username,
        owner_full_name=team.owner_student.full_name,
        is_public=team.is_public,
        max_members=team.max_members,
        members=[
            {
                "student_id": member.student_id,
                "username": member.student.user.username,
                "full_name": member.student.full_name,
                "role": member.role,
            }
            for member in team.members
        ],
        requirements=[
            {
                "id": requirement.id,
                "role_title": requirement.role_title,
                "description": requirement.description,
                "slots": requirement.slots,
                "experience_level": requirement.experience_level.value if requirement.experience_level else None,
                "is_open": requirement.is_open,
                "skills": [
                    {
                        "skill_id": rs.skill_id,
                        "name": rs.skill.name,
                        "category": rs.skill.category,
                    }
                    for rs in requirement.requirement_skills
                ],
            }
            for requirement in team.requirements
        ],
    )
