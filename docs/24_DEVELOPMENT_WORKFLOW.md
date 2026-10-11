# DEV BYTE â€” Two-Person Development Workflow

## Monorepo
```text
backend/
â”œâ”€â”€ backend/
â”œâ”€â”€ frontend/
â”œâ”€â”€ docs/
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ .env.example
â””â”€â”€ README.md
```

## Backend developer
Owns API, DB, services, AI, ingestion, judging and backend tests.

## Frontend developer
Owns pages, components, routing, API client, forms and frontend tests.

## Git
Feature branches + pull requests. Examples:
backend/auth, backend/teams, backend/hackathons, backend/arena, backend/ai
frontend/auth, frontend/student-dashboard, frontend/mentor-dashboard, frontend/arena.

## Shared development
Use shared development API/database; do not give frontend direct database credentials.

## Database workflow
Change model â†’ Alembic migration â†’ review/test â†’ commit â†’ teammate applies migration.

## API workflow
For each endpoint document method, path, auth, request, response, errors and pagination/filter behavior.

## Definition of done
UI + API + data/migration + tests + integration all work for the feature's acceptance criteria.

