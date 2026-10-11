from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum

from sqlalchemy import (
    BIGINT,
    DECIMAL,
    Boolean,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserRole(str, Enum):
    STUDENT = "student"
    MENTOR = "mentor"


class ProficiencyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class ProjectStatus(str, Enum):
    IDEA = "idea"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class TeamInvitationStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class HackathonMode(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    HYBRID = "hybrid"


class HackathonStatus(str, Enum):
    UPCOMING = "upcoming"
    ACTIVE = "active"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class SkillSwapStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    COMPLETED = "completed"


class MeetingMode(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"


class SessionStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class ProblemStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ContestStatus(str, Enum):
    DRAFT = "draft"
    UPCOMING = "upcoming"
    LIVE = "live"
    ENDED = "ended"


class SubmissionLanguage(str, Enum):
    CPP = "cpp"
    PYTHON = "python"
    JAVA = "java"


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"


class PaymentStatus(str, Enum):
    NOT_REQUIRED = "not_required"
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"


class AssignmentType(str, Enum):
    CODING = "coding"
    PROJECT = "project"


class AssignmentStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ACTIVE = "active"
    CLOSED = "closed"


class AssignmentRecipientStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    REVIEWED = "reviewed"
    OVERDUE = "overdue"


class DayOfWeek(int, Enum):
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
    SATURDAY = 6
    SUNDAY = 7


def utcnow() -> datetime:
    return datetime.utcnow()


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    student_profile: Mapped["StudentProfile | None"] = relationship(back_populates="user", uselist=False)
    mentor_profile: Mapped["MentorProfile | None"] = relationship(back_populates="user", uselist=False)


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("users.id"), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text)
    college: Mapped[str | None] = mapped_column(String(150))
    branch: Mapped[str | None] = mapped_column(String(100))
    year: Mapped[int | None] = mapped_column(Integer)
    profile_image_url: Mapped[str | None] = mapped_column(String(500))
    github_url: Mapped[str | None] = mapped_column(String(500))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    portfolio_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    user: Mapped[User] = relationship(back_populates="student_profile")
    skills: Mapped[list["StudentSkill"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    learning_goals: Mapped[list["StudentLearningGoal"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    team_members: Mapped[list["TeamMember"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    project_members: Mapped[list["ProjectMember"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    owned_projects: Mapped[list["Project"]] = relationship(back_populates="owner_student", foreign_keys="Project.owner_student_id")
    owned_teams: Mapped[list["Team"]] = relationship(back_populates="owner_student", foreign_keys="Team.owner_student_id")
    hackathon_bookmarks: Mapped[list["HackathonBookmark"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    skill_swap_requests_sent: Mapped[list["SkillSwapRequest"]] = relationship(back_populates="requester_student", foreign_keys="SkillSwapRequest.requester_student_id")
    skill_swap_requests_received: Mapped[list["SkillSwapRequest"]] = relationship(back_populates="recipient_student", foreign_keys="SkillSwapRequest.recipient_student_id")
    feedback_reviews: Mapped[list["SkillSwapFeedback"]] = relationship(back_populates="reviewer_student", cascade="all, delete-orphan")
    contest_participations: Mapped[list["ContestParticipant"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    mentor_bookings: Mapped[list["MentorBooking"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    assignment_recipients: Mapped[list["AssignmentRecipient"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    xp_events: Mapped[list["XPEvent"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    reputation_events: Mapped[list["ReputationEvent"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    student_badges: Mapped[list["StudentBadge"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    ai_conversations: Mapped[list["AIConversation"]] = relationship(back_populates="student", cascade="all, delete-orphan")


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("users.id"), unique=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text)
    organization: Mapped[str | None] = mapped_column(String(150))
    experience_years: Mapped[Decimal | None] = mapped_column(DECIMAL(4, 1))
    profile_image_url: Mapped[str | None] = mapped_column(String(500))
    github_url: Mapped[str | None] = mapped_column(String(500))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    website_url: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    user: Mapped[User] = relationship(back_populates="mentor_profile")
    session_offerings: Mapped[list["MentorSessionOffering"]] = relationship(back_populates="mentor", cascade="all, delete-orphan")
    mentor_availability: Mapped[list["MentorAvailability"]] = relationship(back_populates="mentor", cascade="all, delete-orphan")
    assignments: Mapped[list["Assignment"]] = relationship(back_populates="mentor", cascade="all, delete-orphan")
    created_contests: Mapped[list["Contest"]] = relationship(back_populates="creator_mentor", cascade="all, delete-orphan")
    created_problems: Mapped[list["CodingProblem"]] = relationship(back_populates="creator_mentor", foreign_keys="CodingProblem.created_by_mentor_id")


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    student_skills: Mapped[list["StudentSkill"]] = relationship(back_populates="skill", cascade="all, delete-orphan")
    student_learning_goals: Mapped[list["StudentLearningGoal"]] = relationship(back_populates="skill", cascade="all, delete-orphan")
    project_skills: Mapped[list["ProjectSkill"]] = relationship(back_populates="skill", cascade="all, delete-orphan")
    requirement_skills: Mapped[list["TeamRequirementSkill"]] = relationship(back_populates="skill", cascade="all, delete-orphan")
    hackathon_skills: Mapped[list["HackathonSkill"]] = relationship(back_populates="skill", cascade="all, delete-orphan")
    swap_offered: Mapped[list["SkillSwapRequest"]] = relationship(back_populates="offered_skill", foreign_keys="SkillSwapRequest.offered_skill_id")
    swap_requested: Mapped[list["SkillSwapRequest"]] = relationship(back_populates="requested_skill", foreign_keys="SkillSwapRequest.requested_skill_id")
    problem_skills: Mapped[list["ProblemSkill"]] = relationship(back_populates="skill", cascade="all, delete-orphan")


class StudentSkill(Base):
    __tablename__ = "student_skills"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), nullable=False)
    proficiency: Mapped[ProficiencyLevel] = mapped_column(SAEnum(ProficiencyLevel), nullable=False)
    can_teach: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    years_experience: Mapped[Decimal | None] = mapped_column(DECIMAL(4, 1))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    __table_args__ = (UniqueConstraint("student_id", "skill_id", name="uq_student_skill"),)

    student: Mapped[StudentProfile] = relationship(back_populates="skills")
    skill: Mapped[Skill] = relationship(back_populates="student_skills")


class StudentLearningGoal(Base):
    __tablename__ = "student_learning_goals"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), nullable=False)
    current_proficiency: Mapped[ProficiencyLevel] = mapped_column(SAEnum(ProficiencyLevel), nullable=False)
    target_proficiency: Mapped[ProficiencyLevel] = mapped_column(SAEnum(ProficiencyLevel), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    student: Mapped[StudentProfile] = relationship(back_populates="learning_goals")
    skill: Mapped[Skill] = relationship(back_populates="student_learning_goals")


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    owner_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    max_members: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    owner_student: Mapped[StudentProfile] = relationship(back_populates="owned_teams", foreign_keys=[owner_student_id])
    members: Mapped[list["TeamMember"]] = relationship(back_populates="team", cascade="all, delete-orphan")
    requirements: Mapped[list["TeamRequirement"]] = relationship(back_populates="team", cascade="all, delete-orphan")
    hackathon_teams: Mapped[list["HackathonTeam"]] = relationship(back_populates="team", cascade="all, delete-orphan")
    invitations: Mapped[list["TeamInvitation"]] = relationship(back_populates="team", cascade="all, delete-orphan")
    projects: Mapped[list["Project"]] = relationship(back_populates="team")


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    owner_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    team_id: Mapped[int | None] = mapped_column(BIGINT, ForeignKey("teams.id"))
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str | None] = mapped_column(String(100))
    status: Mapped[ProjectStatus] = mapped_column(SAEnum(ProjectStatus), nullable=False, default=ProjectStatus.IN_PROGRESS)
    github_url: Mapped[str | None] = mapped_column(String(500))
    demo_url: Mapped[str | None] = mapped_column(String(500))
    image_url: Mapped[str | None] = mapped_column(String(500))
    is_public: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    owner_student: Mapped[StudentProfile] = relationship(back_populates="owned_projects", foreign_keys=[owner_student_id])
    team: Mapped[Team | None] = relationship(back_populates="projects")
    members: Mapped[list["ProjectMember"]] = relationship(back_populates="project", cascade="all, delete-orphan")
    project_skills: Mapped[list["ProjectSkill"]] = relationship(back_populates="project", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("teams.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(100), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    __table_args__ = (UniqueConstraint("team_id", "student_id", name="uq_team_member"),)

    team: Mapped[Team] = relationship(back_populates="members")
    student: Mapped[StudentProfile] = relationship(back_populates="team_members")


class TeamInvitation(Base):
    __tablename__ = "team_invitations"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("teams.id"), nullable=False)
    inviter_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    invitee_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    status: Mapped[TeamInvitationStatus] = mapped_column(SAEnum(TeamInvitationStatus), nullable=False, default=TeamInvitationStatus.PENDING)
    message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    responded_at: Mapped[datetime | None] = mapped_column(DateTime)

    team: Mapped[Team] = relationship(back_populates="invitations")


class TeamRequirement(Base):
    __tablename__ = "team_requirements"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    team_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("teams.id"), nullable=False)
    role_title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    slots: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    experience_level: Mapped[ProficiencyLevel | None] = mapped_column(SAEnum(ProficiencyLevel))
    is_open: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    team: Mapped[Team] = relationship(back_populates="requirements")
    requirement_skills: Mapped[list["TeamRequirementSkill"]] = relationship(back_populates="requirement", cascade="all, delete-orphan")


class ProjectMember(Base):
    __tablename__ = "project_members"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("projects.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    role: Mapped[str | None] = mapped_column(String(100))
    joined_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    __table_args__ = (UniqueConstraint("project_id", "student_id", name="uq_project_member"),)

    project: Mapped[Project] = relationship(back_populates="members")
    student: Mapped[StudentProfile] = relationship(back_populates="project_members")


class ProjectSkill(Base):
    __tablename__ = "project_skills"

    project_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("projects.id"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), primary_key=True)

    project: Mapped[Project] = relationship(back_populates="project_skills")
    skill: Mapped[Skill] = relationship(back_populates="project_skills")


class TeamRequirementSkill(Base):
    __tablename__ = "team_requirement_skills"

    requirement_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("team_requirements.id"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), primary_key=True)

    requirement: Mapped[TeamRequirement] = relationship(back_populates="requirement_skills")
    skill: Mapped[Skill] = relationship(back_populates="requirement_skills")


class Hackathon(Base):
    __tablename__ = "hackathons"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    organizer: Mapped[str] = mapped_column(String(150), nullable=False)
    mode: Mapped[HackathonMode] = mapped_column(SAEnum(HackathonMode), nullable=False)
    location: Mapped[str | None] = mapped_column(String(200))
    registration_url: Mapped[str] = mapped_column(String(500), nullable=False)
    source: Mapped[str] = mapped_column(String(100), nullable=False)
    source_event_id: Mapped[str | None] = mapped_column(String(200))
    source_url: Mapped[str | None] = mapped_column(String(500))
    deadline: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    start_date: Mapped[datetime | None] = mapped_column(DateTime)
    end_date: Mapped[datetime | None] = mapped_column(DateTime)
    prize_description: Mapped[str | None] = mapped_column(String(500))
    team_size_min: Mapped[int | None] = mapped_column(Integer)
    team_size_max: Mapped[int | None] = mapped_column(Integer)
    banner_url: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="upcoming")
    last_synced_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    hackathon_skills: Mapped[list["HackathonSkill"]] = relationship(back_populates="hackathon", cascade="all, delete-orphan")
    bookmarks: Mapped[list["HackathonBookmark"]] = relationship(back_populates="hackathon", cascade="all, delete-orphan")
    hackathon_teams: Mapped[list["HackathonTeam"]] = relationship(back_populates="hackathon", cascade="all, delete-orphan")


class HackathonSkill(Base):
    __tablename__ = "hackathon_skills"

    hackathon_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("hackathons.id"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), primary_key=True)

    hackathon: Mapped[Hackathon] = relationship(back_populates="hackathon_skills")
    skill: Mapped[Skill] = relationship(back_populates="hackathon_skills")


class HackathonBookmark(Base):
    __tablename__ = "hackathon_bookmarks"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    hackathon_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("hackathons.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    __table_args__ = (UniqueConstraint("student_id", "hackathon_id", name="uq_hackathon_bookmark"),)

    student: Mapped[StudentProfile] = relationship(back_populates="hackathon_bookmarks")
    hackathon: Mapped[Hackathon] = relationship(back_populates="bookmarks")


class HackathonTeam(Base):
    __tablename__ = "hackathon_teams"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    hackathon_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("hackathons.id"), nullable=False)
    team_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("teams.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="interested")
    registration_reference: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    __table_args__ = (UniqueConstraint("hackathon_id", "team_id", name="uq_hackathon_team"),)

    hackathon: Mapped[Hackathon] = relationship(back_populates="hackathon_teams")
    team: Mapped[Team] = relationship(back_populates="hackathon_teams")


class SkillSwapRequest(Base):
    __tablename__ = "skill_swap_requests"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    requester_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    recipient_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    offered_skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), nullable=False)
    requested_skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), nullable=False)
    message: Mapped[str | None] = mapped_column(Text)
    status: Mapped[SkillSwapStatus] = mapped_column(SAEnum(SkillSwapStatus), nullable=False, default=SkillSwapStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    requester_student: Mapped[StudentProfile] = relationship(back_populates="skill_swap_requests_sent", foreign_keys=[requester_student_id])
    recipient_student: Mapped[StudentProfile] = relationship(back_populates="skill_swap_requests_received", foreign_keys=[recipient_student_id])
    offered_skill: Mapped[Skill] = relationship(back_populates="swap_offered", foreign_keys=[offered_skill_id])
    requested_skill: Mapped[Skill] = relationship(back_populates="swap_requested", foreign_keys=[requested_skill_id])
    sessions: Mapped[list["SkillSwapSession"]] = relationship(back_populates="request", cascade="all, delete-orphan")


class SkillSwapSession(Base):
    __tablename__ = "skill_swap_sessions"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    request_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skill_swap_requests.id"), nullable=False)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    meeting_mode: Mapped[MeetingMode] = mapped_column(SAEnum(MeetingMode), nullable=False, default=MeetingMode.ONLINE)
    meeting_link: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[SessionStatus] = mapped_column(SAEnum(SessionStatus), nullable=False, default=SessionStatus.SCHEDULED)
    session_notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    request: Mapped[SkillSwapRequest] = relationship(back_populates="sessions")
    feedback: Mapped[list["SkillSwapFeedback"]] = relationship(back_populates="session", cascade="all, delete-orphan")


class SkillSwapFeedback(Base):
    __tablename__ = "skill_swap_feedback"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skill_swap_sessions.id"), nullable=False)
    reviewer_student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    feedback: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    __table_args__ = (UniqueConstraint("session_id", "reviewer_student_id", name="uq_swap_feedback"),)

    session: Mapped[SkillSwapSession] = relationship(back_populates="feedback")
    reviewer_student: Mapped[StudentProfile] = relationship(back_populates="feedback_reviews")


class CodingProblem(Base):
    __tablename__ = "coding_problems"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    created_by_mentor_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("mentor_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[Difficulty] = mapped_column(SAEnum(Difficulty), nullable=False)
    input_format: Mapped[str | None] = mapped_column(Text)
    output_format: Mapped[str | None] = mapped_column(Text)
    constraints: Mapped[str | None] = mapped_column(Text)
    time_limit_ms: Mapped[int] = mapped_column(Integer, nullable=False, default=2000)
    memory_limit_mb: Mapped[int] = mapped_column(Integer, nullable=False, default=256)
    status: Mapped[ProblemStatus] = mapped_column(SAEnum(ProblemStatus), nullable=False, default=ProblemStatus.DRAFT)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    creator_mentor: Mapped[MentorProfile] = relationship(back_populates="created_problems", foreign_keys=[created_by_mentor_id])
    problem_skills: Mapped[list["ProblemSkill"]] = relationship(back_populates="problem", cascade="all, delete-orphan")
    test_cases: Mapped[list["TestCase"]] = relationship(back_populates="problem", cascade="all, delete-orphan")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="problem", cascade="all, delete-orphan")
    contest_problems: Mapped[list["ContestProblem"]] = relationship(back_populates="problem", cascade="all, delete-orphan")


class ProblemSkill(Base):
    __tablename__ = "problem_skills"

    problem_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("coding_problems.id"), primary_key=True)
    skill_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("skills.id"), primary_key=True)

    problem: Mapped[CodingProblem] = relationship(back_populates="problem_skills")
    skill: Mapped[Skill] = relationship(back_populates="problem_skills")


class TestCase(Base):
    __tablename__ = "test_cases"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    problem_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("coding_problems.id"), nullable=False)
    input_data: Mapped[str] = mapped_column(Text, nullable=False)
    expected_output: Mapped[str] = mapped_column(Text, nullable=False)
    is_hidden: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sequence_no: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    problem: Mapped[CodingProblem] = relationship(back_populates="test_cases")


class Contest(Base):
    __tablename__ = "contests"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    created_by_mentor_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("mentor_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[ContestStatus] = mapped_column(SAEnum(ContestStatus), nullable=False, default=ContestStatus.DRAFT)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    creator_mentor: Mapped[MentorProfile] = relationship(back_populates="created_contests", foreign_keys=[created_by_mentor_id])
    contest_problems: Mapped[list["ContestProblem"]] = relationship(back_populates="contest", cascade="all, delete-orphan")
    participants: Mapped[list["ContestParticipant"]] = relationship(back_populates="contest", cascade="all, delete-orphan")
    submissions: Mapped[list["Submission"]] = relationship(back_populates="contest", cascade="all, delete-orphan")


class ContestProblem(Base):
    __tablename__ = "contest_problems"

    contest_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("contests.id"), primary_key=True)
    problem_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("coding_problems.id"), primary_key=True)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    sequence_no: Mapped[int] = mapped_column(Integer, nullable=False)

    contest: Mapped[Contest] = relationship(back_populates="contest_problems")
    problem: Mapped[CodingProblem] = relationship(back_populates="contest_problems")


class ContestParticipant(Base):
    __tablename__ = "contest_participants"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    contest_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("contests.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    joined_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    final_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    rank: Mapped[int | None] = mapped_column(Integer)

    __table_args__ = (UniqueConstraint("contest_id", "student_id", name="uq_contest_student"),)

    contest: Mapped[Contest] = relationship(back_populates="participants")
    student: Mapped[StudentProfile] = relationship(back_populates="contest_participations")


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    problem_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("coding_problems.id"), nullable=False)
    contest_id: Mapped[int | None] = mapped_column(BIGINT, ForeignKey("contests.id"))
    language: Mapped[SubmissionLanguage] = mapped_column(SAEnum(SubmissionLanguage), nullable=False)
    source_reference: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="queued")
    score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    student: Mapped[StudentProfile] = relationship(back_populates="submissions")
    problem: Mapped[CodingProblem] = relationship(back_populates="submissions")
    contest: Mapped[Contest | None] = relationship(back_populates="submissions")
    result: Mapped["SubmissionResult | None"] = relationship(back_populates="submission", uselist=False, cascade="all, delete-orphan")


class SubmissionResult(Base):
    __tablename__ = "submission_results"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    submission_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("submissions.id"), nullable=False)
    tests_passed: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    tests_total: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    execution_time_ms: Mapped[int | None] = mapped_column(Integer)
    memory_used_kb: Mapped[int | None] = mapped_column(Integer)
    compiler_message: Mapped[str | None] = mapped_column(Text)
    runtime_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    submission: Mapped[Submission] = relationship(back_populates="result")


class MentorSessionOffering(Base):
    __tablename__ = "mentor_session_offerings"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    mentor_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("mentor_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    price_amount: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False, default=Decimal("0.00"))
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    mentor: Mapped[MentorProfile] = relationship(back_populates="session_offerings")
    bookings: Mapped[list["MentorBooking"]] = relationship(back_populates="offering", cascade="all, delete-orphan")


class MentorAvailability(Base):
    __tablename__ = "mentor_availability"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    mentor_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("mentor_profiles.id"), nullable=False)
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[datetime | None] = mapped_column(Time, nullable=False)
    end_time: Mapped[datetime | None] = mapped_column(Time, nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, default="Asia/Kolkata")
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    mentor: Mapped[MentorProfile] = relationship(back_populates="mentor_availability")


class MentorBooking(Base):
    __tablename__ = "mentor_bookings"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    offering_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("mentor_session_offerings.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    scheduled_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    meeting_link: Mapped[str | None] = mapped_column(String(500))
    status: Mapped[BookingStatus] = mapped_column(SAEnum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    payment_status: Mapped[PaymentStatus] = mapped_column(SAEnum(PaymentStatus), nullable=False, default=PaymentStatus.NOT_REQUIRED)
    payment_reference: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    offering: Mapped[MentorSessionOffering] = relationship(back_populates="bookings")
    student: Mapped[StudentProfile] = relationship(back_populates="mentor_bookings")


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    mentor_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("mentor_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    assignment_type: Mapped[AssignmentType] = mapped_column(SAEnum(AssignmentType), nullable=False)
    due_at: Mapped[datetime | None] = mapped_column(DateTime)
    allow_late_submission: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    status: Mapped[AssignmentStatus] = mapped_column(SAEnum(AssignmentStatus), nullable=False, default=AssignmentStatus.DRAFT)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    mentor: Mapped[MentorProfile] = relationship(back_populates="assignments")
    recipients: Mapped[list["AssignmentRecipient"]] = relationship(back_populates="assignment", cascade="all, delete-orphan")


class AssignmentRecipient(Base):
    __tablename__ = "assignment_recipients"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    assignment_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("assignments.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    status: Mapped[AssignmentRecipientStatus] = mapped_column(SAEnum(AssignmentRecipientStatus), nullable=False, default=AssignmentRecipientStatus.NOT_STARTED)
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    score: Mapped[int | None] = mapped_column(Integer)

    __table_args__ = (UniqueConstraint("assignment_id", "student_id", name="uq_assignment_student"),)

    assignment: Mapped[Assignment] = relationship(back_populates="recipients")
    student: Mapped[StudentProfile] = relationship(back_populates="assignment_recipients")
    submission: Mapped["AssignmentSubmission | None"] = relationship(back_populates="recipient", uselist=False, cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    assignment_recipient_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("assignment_recipients.id"), nullable=False)
    project_url: Mapped[str | None] = mapped_column(String(500))
    answer_text: Mapped[str | None] = mapped_column(Text)
    source_reference: Mapped[str | None] = mapped_column(String(500))
    submitted_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime)
    reviewer_score: Mapped[int | None] = mapped_column(Integer)
    reviewer_feedback: Mapped[str | None] = mapped_column(Text)

    recipient: Mapped[AssignmentRecipient] = relationship(back_populates="submission")


class XPEvent(Base):
    __tablename__ = "xp_events"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    reference_type: Mapped[str | None] = mapped_column(String(100))
    reference_id: Mapped[int | None] = mapped_column(BIGINT)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    student: Mapped[StudentProfile] = relationship(back_populates="xp_events")


class ReputationEvent(Base):
    __tablename__ = "reputation_events"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    reference_type: Mapped[str | None] = mapped_column(String(100))
    reference_id: Mapped[int | None] = mapped_column(BIGINT)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    student: Mapped[StudentProfile] = relationship(back_populates="reputation_events")


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    criteria_type: Mapped[str] = mapped_column(String(100), nullable=False)
    criteria_value: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    student_badges: Mapped[list["StudentBadge"]] = relationship(back_populates="badge", cascade="all, delete-orphan")


class StudentBadge(Base):
    __tablename__ = "student_badges"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    badge_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("badges.id"), nullable=False)
    awarded_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    __table_args__ = (UniqueConstraint("student_id", "badge_id", name="uq_student_badge"),)

    student: Mapped[StudentProfile] = relationship(back_populates="student_badges")
    badge: Mapped[Badge] = relationship(back_populates="student_badges")


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("student_profiles.id"), nullable=False)
    title: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    student: Mapped[StudentProfile] = relationship(back_populates="ai_conversations")
    messages: Mapped[list["AIMessage"]] = relationship(back_populates="conversation", cascade="all, delete-orphan")


class AIMessage(Base):
    __tablename__ = "ai_messages"

    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    conversation_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("ai_conversations.id"), nullable=False)
    role: Mapped[str] = mapped_column(SAEnum("user", "assistant", "system", name="ai_message_role"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=utcnow)

    conversation: Mapped[AIConversation] = relationship(back_populates="messages")


__all__ = [
    "User",
    "StudentProfile",
    "MentorProfile",
    "Skill",
    "StudentSkill",
    "StudentLearningGoal",
    "Project",
    "ProjectMember",
    "ProjectSkill",
    "Team",
    "TeamMember",
    "TeamInvitation",
    "TeamRequirement",
    "TeamRequirementSkill",
    "Hackathon",
    "HackathonSkill",
    "HackathonBookmark",
    "HackathonTeam",
    "SkillSwapRequest",
    "SkillSwapSession",
    "SkillSwapFeedback",
    "CodingProblem",
    "ProblemSkill",
    "TestCase",
    "Contest",
    "ContestProblem",
    "ContestParticipant",
    "Submission",
    "SubmissionResult",
    "MentorSessionOffering",
    "MentorAvailability",
    "MentorBooking",
    "Assignment",
    "AssignmentRecipient",
    "AssignmentSubmission",
    "XPEvent",
    "ReputationEvent",
    "Badge",
    "StudentBadge",
    "AIConversation",
    "AIMessage",
]
