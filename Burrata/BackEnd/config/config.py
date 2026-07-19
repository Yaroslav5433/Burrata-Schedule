from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import final, Optional, List
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parents[1]

@final 
class GlobalConfig(BaseSettings):

    DEBUG: bool

    WEBHOOK_PATH: str

    CORS_ORIGINS: List[str]
    CORS_CREDENTIALS: bool
    CORS_METHODS: List[str]
    CORS_HEADERS: List[str]

    DB_NAME: Optional[str]
    DB_USER: Optional[str]
    DB_PASSWORD: Optional[str]
    DB_HOST: Optional[str]
    DB_PORT: Optional[int]
    DB_ECHO: bool

    JWT_SECRET_KEY: str
    JWT_ACCESS_COOKIE_NAME: str
    JWT_TOKEN_LOCATION: List[str]

    @property   
    def DB_URL_asyncpg(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property   
    def DB_URL_syncpg(self):
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    model_config = SettingsConfigDict(
        env_file = BASE_DIR / ".env"
    )

@lru_cache()
def get_config() -> GlobalConfig:
    return GlobalConfig()


    