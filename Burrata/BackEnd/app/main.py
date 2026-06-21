from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from loguru import logger
from config.config import get_config
from database.database import init_db, async_engine
from routes import all_routers

global_config = get_config()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application")
    try:
        await init_db()
        logger.info("Application started successfully")
        yield
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise
    finally:
        logger.info("Shutting down application")
        await async_engine.dispose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = global_config.CORS_ORIGINS,
    allow_credentials = global_config.CORS_CREDENTIALS,
    allow_methods = global_config.CORS_METHODS,
    allow_headers = global_config.CORS_HEADERS,
)

for router in all_routers:
    app.include_router(router)