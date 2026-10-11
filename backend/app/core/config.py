from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _resolve_env_file() -> str | None:
    project_root = Path(__file__).resolve().parents[3]
    candidates = [
        project_root / ".env",
        project_root / "backend" / ".env",
        project_root / ".env.example",
        project_root / "backend" / ".env.example",
    ]
    for candidate in candidates:
        if candidate.exists():
            return str(candidate)
    return None


class Settings(BaseSettings):
    app_name: str = "DEV BYTE"
    environment: str = "development"
    api_prefix: str = "/api"
    database_url: str = "mysql+pymysql://devrank:change_me@localhost:3307/devrank"
    jwt_secret: str = ""
    gemini_api_key: str = ""
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        extra="ignore",
        env_file=_resolve_env_file(),
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
