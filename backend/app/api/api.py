from fastapi import APIRouter

from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.hackathons import router as hackathons_router
from app.api.endpoints.health import router as health_router
from app.api.endpoints.profiles import router as profiles_router
from app.api.endpoints.projects import router as projects_router
from app.api.endpoints.skills import router as skills_router
from app.api.endpoints.teams import router as teams_router

api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(profiles_router, tags=["profiles"])
api_router.include_router(skills_router, tags=["skills"])
api_router.include_router(projects_router, tags=["projects"])
api_router.include_router(teams_router, tags=["teams"])
api_router.include_router(hackathons_router, tags=["hackathons"])
