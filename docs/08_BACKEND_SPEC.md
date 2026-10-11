# DEV BYTE â€” Backend Specification

## Stack
Python, FastAPI, Pydantic, SQLAlchemy 2.x, Alembic, MySQL.

## Structure
```text
backend/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ main.py
â”‚   â”œâ”€â”€ core/
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ schemas/
â”‚   â”œâ”€â”€ api/endpoints/
â”‚   â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ integrations/
â”‚   â”œâ”€â”€ ai/
â”‚   â”œâ”€â”€ workers/
â”‚   â””â”€â”€ tests/
â”œâ”€â”€ alembic/
â”œâ”€â”€ requirements.txt
â”œâ”€â”€ Dockerfile
â””â”€â”€ alembic.ini
```

## Services
AuthService, StudentService, MentorService, SkillService, ProjectService, TeamService, HackathonService, HackathonIngestion, TeamMatcherService, SkillSwapService, ProblemService, SubmissionService, JudgeService, ContestService, MentorSessionService, AssignmentService, GamificationService, AIMentorService.

## Current scope APIs
Auth, student/mentor profiles, skills, projects, teams, hackathons, team matching, skill swap, problems/submissions/contests, mentor sessions, assignments, gamification, AI Mentor.

## Workers
Hackathon sync and isolated code execution.

## Rules
Use service layer for business logic; explicit request/response schemas; ownership checks; consistent errors; health endpoint `/health`.
