from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from config.config import get_config
from loguru import logger

global_config = get_config()

async_engine = create_async_engine(
    url = global_config.DB_URL_asyncpg,
    echo = global_config.DB_ECHO
)

async_session_factory = async_sessionmaker(
    async_engine,
    class_ = AsyncSession,
    expire_on_commit = False)

class Base(DeclarativeBase):
    pass

async def get_db():
    session = async_session_factory()
    logger.info("Creating a new database session")
    try:
        yield session
    except Exception as e:
        logger.error(f"Database session failed: {e}")
        await session.rollback()
        raise
    finally:
        logger.info("Closing database session")
        await session.aclose()

async def init_db() -> None:
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise
    