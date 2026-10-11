from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from sqlalchemy.orm import Session

from app.models import (
    Project,
    ProjectMember,
    ProjectSkill,
    StudentProfile,
    Team,
    TeamMember,
    Skill,
)


class ProjectNotFoundError(LookupError):
    pass


class ProjectConflictError(ValueError):
    pass


class ProjectService:
    @staticmethod
    def _student_project(db: Session, student: StudentProfile, project_id: int) -> Project:
        project = db.get(Project, project_id)
        if project is None or project.owner_student_id != student.id:
            raise ProjectNotFoundError("Project not found")
        return project

    @staticmethod
    def _skills(db: Session, skill_ids: list[int]) -> list[Skill]:
        if len(skill_ids) != len(set(skill_ids)):
            raise ProjectConflictError("Duplicate project skills are not allowed")
        if not skill_ids:
            return []
        skills = db.query(Skill).filter(Skill.id.in_(skill_ids)).all()
        if len(skills) != len(skill_ids):
            raise ProjectNotFoundError("One or more skills not found")
        return skills

    @staticmethod
    def _validate_team(db: Session, student: StudentProfile, team_id: int | None) -> Team | None:
        if team_id is None:
            return None
        team = db.get(Team, team_id)
        if team is None:
            raise ProjectNotFoundError("Team not found")
        is_member = db.query(TeamMember).filter(
            TeamMember.team_id == team.id,
            TeamMember.student_id == student.id,
        ).first()
        if team.owner_student_id != student.id and is_member is None:
            raise ProjectConflictError("Student is not a member of this team")
        return team

    @staticmethod
    def list_owned(db: Session, student: StudentProfile) -> list[Project]:
        return (
            db.query(Project)
            .filter(Project.owner_student_id == student.id)
            .order_by(Project.updated_at.desc(), Project.id.desc())
            .all()
        )

    @staticmethod
    def create(db: Session, student: StudentProfile, values: Mapping[str, Any]) -> Project:
        data = dict(values)
        skill_ids = data.pop("skill_ids", [])
        ProjectService._validate_team(db, student, data.get("team_id"))
        skills = ProjectService._skills(db, skill_ids)
        project = Project(owner_student_id=student.id, **data)
        db.add(project)
        db.flush()
        db.add(ProjectMember(project_id=project.id, student_id=student.id, role="owner"))
        for skill in skills:
            db.add(ProjectSkill(project_id=project.id, skill_id=skill.id))
        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def get_public_or_owned(
        db: Session,
        project_id: int,
        student: StudentProfile | None = None,
    ) -> Project:
        project = db.get(Project, project_id)
        if project is None:
            raise ProjectNotFoundError("Project not found")
        if project.is_public or (student is not None and project.owner_student_id == student.id):
            return project
        raise ProjectNotFoundError("Project not found")

    @staticmethod
    def update(
        db: Session,
        student: StudentProfile,
        project_id: int,
        values: Mapping[str, Any],
    ) -> Project:
        project = ProjectService._student_project(db, student, project_id)
        data = dict(values)
        skill_ids = data.pop("skill_ids", None)
        if "team_id" in data:
            ProjectService._validate_team(db, student, data["team_id"])
        for field, value in data.items():
            setattr(project, field, value)
        if skill_ids is not None:
            skills = ProjectService._skills(db, skill_ids)
            project.project_skills.clear()
            for skill in skills:
                project.project_skills.append(ProjectSkill(project_id=project.id, skill_id=skill.id))
        db.commit()
        db.refresh(project)
        return project

    @staticmethod
    def delete(db: Session, student: StudentProfile, project_id: int) -> None:
        project = ProjectService._student_project(db, student, project_id)
        db.delete(project)
        db.commit()

