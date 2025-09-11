"""Production environment configuration."""
# mypy: ignore-errors
from ..utils.logging import ColorFormatter, StandardFormatter
from .base import Settings


class SettingsProd(Settings):
    DEBUG: bool = False

    LOGGING_CONFIG: dict = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "colorFormatter": {"()": ColorFormatter},
            "standardFormatter": {"()": StandardFormatter},
        },
        "handlers": {
            "consoleHandler": {
                "class": "logging.StreamHandler",
                "level": "ERROR",
                "formatter": "standardFormatter",
                "stream": "ext://sys.stdout",
            },
        },
        "loggers": {
            "smc_crawler": {
                "handlers": ["consoleHandler"],
                "level": "ERROR",
            },
            "uvicorn": {"handlers": ["consoleHandler"]},
            "uvicorn.access": {"handlers": []},
        },
    }
