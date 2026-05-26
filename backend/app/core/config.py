from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str

<<<<<<< HEAD
    SMTP_HOST: str
    SMTP_PORT: int = 465
    SMTP_USERNAME: str
    SMTP_PASSWORD: str
    SMTP_FROM_EMAIL: str
    SMTP_USE_SSL: bool = True

    FRONTEND_RESET_PASSWORD_URL: str

=======
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    TMDB_API_KEY: str
    TMDB_BASE_URL: str = "https://api.themoviedb.org/3"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
