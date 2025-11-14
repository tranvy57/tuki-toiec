"""Base settings class with project, DB, JWT, CORS, and logging configs."""

import os
from dotenv import load_dotenv
import secrets
import ast
from typing import List, Union, Dict, Optional, Any

from pydantic import AnyHttpUrl, field_validator, ValidationInfo
from pydantic_settings import BaseSettings
from ..utils.logging import StandardFormatter, ColorFormatter

load_dotenv()

class Settings(BaseSettings):
    # ------------------ Project ------------------
    PROJECT_NAME: str = "ai"
    PROJECT_SLUG: str = "app"
    DEBUG: bool = True
    API_STR: str = "/api/v1"

    # ------------------ JWT / Token ------------------
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8        # 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES_ADMIN: int = 60 * 24 * 30 * 6  # 6 months
    JWT_ENCODE_ALGORITHM: str = "HS256"

    # ------------------ CORS ------------------
    CORS_ORIGINS: Union[str, List[AnyHttpUrl]] = []
    CORS_ORIGIN_REGEX: Optional[str] = None
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    CORS_CREDENTIALS: bool = True

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Convert comma-separated string or JSON list string to list."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, str):
            try:
                return ast.literal_eval(v)
            except Exception:
                return [v]
        elif isinstance(v, list):
            return v
        return []

    # ------------------ Database ------------------
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "postgres")
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> str:
        """Assemble DB connection string if not provided."""
        if isinstance(v, str) and v:
            return v
        data = info.data
        return (
            f"postgresql://{data.get('POSTGRES_USER')}:{data.get('POSTGRES_PASSWORD')}"
            f"@{data.get('POSTGRES_SERVER')}/{data.get('POSTGRES_DB')}"
        )

    # ------------------ Logging ------------------
    LOGGING_CONFIG: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "colorFormatter": {"()": ColorFormatter},
            "standardFormatter": {"()": StandardFormatter},
        },
        "handlers": {
            "consoleHandler": {
                "class": "logging.StreamHandler",
                "level": "DEBUG",
                "formatter": "standardFormatter",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "app": {"handlers": ["consoleHandler"], "level": "DEBUG"},
            "uvicorn": {"handlers": ["consoleHandler"]},
            "uvicorn.access": {"handlers": []},  # disable uvicorn.access
        },
    }

    class Config:
        case_sensitive = True


# Create settings instance
settings = Settings()
