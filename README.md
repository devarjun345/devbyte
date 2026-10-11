# DEV BYTE

DEV BYTE is a modular monolith prototype for team discovery, hackathons, mentor sessions, skill swap, and battle arena workflows.

## Stack
- Backend: Python 3.12, FastAPI, Pydantic, SQLAlchemy 2.x, Alembic
- Database: MySQL
- Frontend: React + TypeScript + Tailwind CSS
- Local database: Docker MySQL service
- AI: Gemini via the Google GenAI SDK

## Backend Python version
The DEV BYTE backend uses Python 3.12.

## Backend virtual environment
The backend virtual environment is `backend/.venv`.

Create it from the project root:

```powershell
py -3.12 -m venv backend/.venv
```

Activate it:

PowerShell:
```powershell
.\backend\.venv\Scripts\Activate.ps1
```

Command Prompt:
```bat
backend\.venv\Scripts\activate.bat
```

Bash/zsh:
```bash
source backend/.venv/bin/activate
```

Install backend dependencies inside this environment:

```bash
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

Verify the active interpreter:

```bash
python --version
```

The project must use Python 3.12.x for backend development.

## Repository layout
```text
backend/
â”œâ”€â”€ backend/
â”œâ”€â”€ frontend/
â”œâ”€â”€ docs/
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ .env.example
â”œâ”€â”€ README.md
â””â”€â”€ .gitignore
```

## Local development
1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```
2. Start MySQL in Docker:
   ```bash
   docker compose up -d mysql
   ```
3. Activate the backend virtual environment.
4. Start the FastAPI app:
   ```bash
   cd backend
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
5. Check the health endpoint:
   ```bash
   curl http://localhost:8000/health
   ```

## Environment variables
See `.env.example` for the base configuration used by local development.

## Notes
This repository is intentionally scaffolded as a foundation for the DEV BYTE prototype. Feature work remains out of scope for this phase.

