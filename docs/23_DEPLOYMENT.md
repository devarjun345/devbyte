# DEV BYTE â€” Deployment Plan

## Local
Frontend local; backend local; MySQL in Docker.

## Shared development
Shared backend and shared development MySQL so both developers can use the same data through the API. Frontend never connects to MySQL.

## Production
Separate frontend/backend and separate MySQL database.

## Environment variables
Backend: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, CORS_ORIGINS.
Frontend: API base URL only.

## Deployment checklist
Build frontend â†’ deploy backend â†’ configure CORS â†’ run Alembic migrations â†’ seed demo data â†’ verify `/health` â†’ smoke-test core flows.

## Current scope
Real payment/payout and automatic Meet creation are not required.

