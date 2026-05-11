from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from config.config import get_config

global_config = get_config()

async_engine = create_async_engine(
    url = global_config.DB_URL_asyncpg,
    echo = global_config.DB_ECHO
)

async_session_factory = async_sessionmaker(
    async_engine,
    class_=AsyncSession)

class Base(DeclarativeBase):
    pass