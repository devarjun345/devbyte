from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from sqlalchemy.orm import Session

from app.models import Skill, StudentLearningGoal, StudentProfile, StudentSkill


class SkillConflictError(ValueError):
    pass


class SkillNotFoundError(LookupError):
    pass


def canonical_skill_name(name: str) -> str:
    return " ".join(name.split()).casefold()


class SkillService:
    @staticmethod
    def list_skills(db: Session, search: str | None = None, category: str | None = None) -> list[Skill]:
        query = db.query(Skill)
        if search:
            query = query.filter(Skill.name.ilike(f"%{search.strip()}%"))
        if category:
            query = query.filter(Skill.category == category.strip())
        return query.order_by(Skill.name.asc()).all()

    @staticmethod
    def get_skill(db: Session, skill_id: int) -> Skill:
        skill = db.get(Skill, skill_id)
        if skill is None:
            raise SkillNotFoundError("Skill not found")
        return skill

    @staticmethod
    def get_student_skill(db: Session, student: StudentProfile, student_skill_id: int) -> StudentSkill:
        student_skill = db.get(StudentSkill, student_skill_id)
        if student_skill is None or student_skill.student_id != student.id:
            raise SkillNotFoundError("Student skill not found")
        return student_skill

    @staticmethod
    def list_student_skills(db: Session, student: StudentProfile) -> list[StudentSkill]:
        return (
            db.query(StudentSkill)
            .filter(StudentSkill.student_id == student.id)
            .order_by(StudentSkill.id.asc())
            .all()
        )

    @staticmethod
    def add_student_skill(
        db: Session,
        student: StudentProfile,
        values: Mapping[str, Any],
    ) -> StudentSkill:
        skill = SkillService.get_skill(db, values["skill_id"])
        duplicate = db.query(StudentSkill).filter(
            StudentSkill.student_id == student.id,
            StudentSkill.skill_id == skill.id,
        ).first()
        if duplicate is not None:
            raise SkillConflictError("Student already has this skill")
        student_skill = StudentSkill(student_id=student.id, **dict(values))
        db.add(student_skill)
        db.commit()
        db.refresh(student_skill)
        return student_skill

    @staticmethod
    def update_student_skill(
        db: Session,
        student: StudentProfile,
        student_skill_id: int,
        values: Mapping[str, Any],
    ) -> StudentSkill:
        student_skill = SkillService.get_student_skill(db, student, student_skill_id)
        for field, value in values.items():
            setattr(student_skill, field, value)
        db.commit()
        db.refresh(student_skill)
        return student_skill

    @staticmethod
    def remove_student_skill(db: Session, student: StudentProfile, student_skill_id: int) -> None:
        student_skill = SkillService.get_student_skill(db, student, student_skill_id)
        db.delete(student_skill)
        db.commit()

    @staticmethod
    def list_learning_goals(db: Session, student: StudentProfile) -> list[StudentLearningGoal]:
        return (
            db.query(StudentLearningGoal)
            .filter(StudentLearningGoal.student_id == student.id)
            .order_by(StudentLearningGoal.id.asc())
            .all()
        )

    @staticmethod
    def add_learning_goal(
        db: Session,
        student: StudentProfile,
        values: Mapping[str, Any],
    ) -> StudentLearningGoal:
        skill = SkillService.get_skill(db, values["skill_id"])
        duplicate = db.query(StudentLearningGoal).filter(
            StudentLearningGoal.student_id == student.id,
            StudentLearningGoal.skill_id == skill.id,
        ).first()
        if duplicate is not None:
            raise SkillConflictError("Student already has a learning goal for this skill")
        goal = StudentLearningGoal(student_id=student.id, **dict(values))
        db.add(goal)
        db.commit()
        db.refresh(goal)
        return goal

    @staticmethod
    def remove_learning_goal(db: Session, student: StudentProfile, goal_id: int) -> None:
        goal = db.get(StudentLearningGoal, goal_id)
        if goal is None or goal.student_id != student.id:
            raise SkillNotFoundError("Learning goal not found")
        db.delete(goal)
        db.commit()
