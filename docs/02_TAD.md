# DEV BYTE â€” Technical Architecture Document (TAD)

## 1. Objective
Create a maintainable modular web application for the hackathon prototype while preserving a path to a public product.

## 2. Stack
### Frontend
React, TypeScript, Tailwind CSS.

### Backend
Python, FastAPI, Pydantic, SQLAlchemy 2.x, Alembic.

### Database
MySQL.

### Infrastructure
Docker/Docker Compose for development; Git/GitHub for collaboration.

### AI
Gemini API using Google's current `google-genai` Python SDK.

### Sessions
Google Meet link stored in DEV BYTE. Automatic Meet/Calendar creation remains a future enhancement.

## 3. Main architecture
Browser â†’ React â†’ FastAPI â†’ Pydantic â†’ services â†’ SQLAlchemy â†’ MySQL.

AI request:
React â†’ FastAPI â†’ AI service â†’ authorized context â†’ Gemini â†’ validated response â†’ React.

## 4. Environments
Local: local backend + Docker MySQL.
Shared development: shared backend + shared development MySQL.
Production: separate backend + separate production MySQL.

The browser never connects directly to MySQL.

## 5. Background work
Hackathon synchronization and code execution should not block normal request handling.

## 6. Code execution
Student code runs outside the main FastAPI process in an isolated runner with CPU, memory, time, filesystem and network restrictions appropriate to the prototype.

## 7. Principles
- Modular monolith first.
- Explicit domain/service boundaries.
- Models separated from API schemas.
- External integrations behind adapters.
- AI behind a service boundary.
- Deterministic business logic first, AI second.
- Separate development and production data.

