from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models import (
    Skill,
    StudentProfile,
    Team,
    TeamInvitation,
    TeamInvitationStatus,
    TeamMember,
    TeamRequirement,
    TeamRequirementSkill,
)


class TeamNotFoundError(LookupError):
    pass


class TeamConflictError(ValueError):
    pass


class TeamService:
    @staticmethod
    def list_visible(db: Session, student: StudentProfile | None = None) -> list[Team]:
        if student is None:
            return db.query(Team).filter(Team.is_public.is_(True)).all()
        return (
            db.query(Team)
            .filter(
                or_(
                    Team.is_public.is_(True),
                    Team.owner_student_id == student.id,
                    Team.members.any(TeamMember.student_id == student.id),
                )
            )
            .all()
        )

    @staticmethod
    def create(db: Session, student: StudentProfile, values: Mapping[str, Any]) -> Team:
        data = dict(values)
        requirements = data.pop("requirements", [])
        team = Team(
            name=data["name"],
            description=data.get("description"),
            is_public=data.get("is_public", True),
            max_members=data.get("max_members", 5),
            owner_student_id=student.id,
        )
        db.add(team)
        db.flush()
        db.add(TeamMember(team_id=team.id, student_id=student.id, role="owner"))
        TeamService._sync_requirements(db, team, requirements)
        db.commit()
        db.refresh(team)
        return team

    @staticmethod
    def get(db: Session, team_id: int, student: StudentProfile | None = None) -> Team:
        team = db.get(Team, team_id)
        if team is None:
            raise TeamNotFoundError("Team not found")
        if team.is_public:
            return team
        if student is not None and (team.owner_student_id == student.id or any(m.student_id == student.id for m in team.members)):
            return team
        raise TeamNotFoundError("Team not found")

    @staticmethod
    def update(db: Session, student: StudentProfile, team_id: int, values: Mapping[str, Any]) -> Team:
        team = TeamService._team_owned_by_student(db, student, team_id)
        data = dict(values)
        requirements = data.pop("requirements", None)
        if "max_members" in data and team.member_count() > int(data["max_members"]):
            raise TeamConflictError("Team max members cannot be smaller than current member count")
        for field, value in data.items():
            setattr(team, field, value)
        if requirements is not None:
            TeamService._sync_requirements(db, team, requirements)
        db.commit()
        db.refresh(team)
        return team

    @staticmethod
    def create_invitation(db: Session, student: StudentProfile, team_id: int, values: Mapping[str, Any]) -> TeamInvitation:
        team = TeamService._team_owned_by_student(db, student, team_id)
        invitee_id = int(values["invitee_student_id"])
        if team.member_count() >= team.max_members:
            raise TeamConflictError("Team is at capacity")
        invitee = db.get(StudentProfile, invitee_id)
        if invitee is None:
            raise TeamNotFoundError("Student not found")
        if invitee.id == student.id:
            raise TeamConflictError("Cannot invite yourself")
        existing_member = db.query(TeamMember).filter(TeamMember.team_id == team.id, TeamMember.student_id == invitee.id).first()
        if existing_member is not None:
            raise TeamConflictError("Student is already a team member")
        existing_pending = (
            db.query(TeamInvitation)
            .filter(
                TeamInvitation.team_id == team.id,
                TeamInvitation.invitee_student_id == invitee.id,
                TeamInvitation.status == TeamInvitationStatus.PENDING,
            )
            .first()
        )
        if existing_pending is not None:
            raise TeamConflictError("Pending invitation already exists")
        invite = TeamInvitation(
            team_id=team.id,
            inviter_student_id=student.id,
            invitee_student_id=invitee.id,
            status=TeamInvitationStatus.PENDING,
            message=values.get("message"),
        )
        db.add(invite)
        db.commit()
        db.refresh(invite)
        return invite

    @staticmethod
    def respond_to_invitation(db: Session, student: StudentProfile, invitation_id: int, status: TeamInvitationStatus) -> TeamInvitation:
        invitation = db.get(TeamInvitation, invitation_id)
        if invitation is None:
            raise TeamNotFoundError("Invitation not found")
        if invitation.invitee_student_id != student.id:
            raise TeamConflictError("Only the invited student can respond to this invitation")
        if invitation.status != TeamInvitationStatus.PENDING:
            raise TeamConflictError("Invitation is no longer pending")
        if status == TeamInvitationStatus.ACCEPTED:
            if invitation.team.member_count() >= invitation.team.max_members:
                raise TeamConflictError("Team is at capacity")
            exists = db.query(TeamMember).filter(TeamMember.team_id == invitation.team_id, TeamMember.student_id == student.id).first()
            if exists is None:
                db.add(TeamMember(team_id=invitation.team_id, student_id=student.id, role="member"))
        invitation.status = status
        db.commit()
        db.refresh(invitation)
        return invitation

    @staticmethod
    def _team_owned_by_student(db: Session, student: StudentProfile, team_id: int) -> Team:
        team = db.get(Team, team_id)
        if team is None:
            raise TeamNotFoundError("Team not found")
        if team.owner_student_id != student.id:
            raise TeamConflictError("Only the team owner can update this team")
        return team

    @staticmethod
    def _sync_requirements(db: Session, team: Team, requirements: list[Mapping[str, Any]]) -> None:
        if requirements is None:
            return
        for existing in list(team.requirements):
            db.delete(existing)
        for requirement_data in requirements:
            requirement = TeamRequirement(
                team_id=team.id,
                role_title=requirement_data["role_title"],
                description=requirement_data.get("description"),
                slots=requirement_data.get("slots", 1),
                experience_level=requirement_data.get("experience_level"),
                is_open=requirement_data.get("is_open", True),
            )
            db.add(requirement)
            db.flush()
            skill_ids = requirement_data.get("skill_ids", [])
            if len(skill_ids) != len(set(skill_ids)):
                raise TeamConflictError("Duplicate team requirement skills are not allowed")
            for skill_id in skill_ids:
                skill = db.get(Skill, skill_id)
                if skill is None:
                    raise TeamNotFoundError("Skill not found")
                db.add(TeamRequirementSkill(requirement_id=requirement.id, skill_id=skill.id))


def _team_member_count(team: Team) -> int:
    return len(team.members)


Team.member_count = _team_member_count
