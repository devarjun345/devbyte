from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.api import api_router
from app.core.config import settings

cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]

app = FastAPI(
    title=settings.app_name,
    version="unversioned",
    description="DEV BYTE API foundation for local development.",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/health", tags=["health"], summary="Application health check")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "DEV BYTE API"}


@app.get("/", tags=["meta"])
async def root() -> dict[str, str]:
    return {"message": "DEV BYTE API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
