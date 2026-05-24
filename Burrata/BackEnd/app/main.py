from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes.auth import login_router
from routes.health import health_router
from routes.verification import verification_router
from routes.claims import claims_router
from routes.getusers import getuser_router
from loguru import logger
from config.config import get_config
from database.database import init_db, async_engine
from redis_.redis_settings import create_redis

global_config = get_config()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application")
    try:
        await init_db()
        app.state.redis_is_connected = False
        try:
            app.state.redis = create_redis(global_config.REDIS_URL)
            app.state.redis_is_connected = await app.state.redis.ping()
            logger.info("Redis has been connected")
        except:
            logger.info("Redis has not been connected")
        logger.info("Application started successfully")
        yield
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise
    finally:
        logger.info("Shutting down application")
        await app.state.redis.aclose()
        await async_engine.dispose()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins = global_config.CORS_ORIGINS,
    allow_credentials = global_config.CORS_CREDENTIALS,
    allow_methods = global_config.CORS_METHODS,
    allow_headers = global_config.CORS_HEADERS,
)

app.include_router(login_router)
app.include_router(health_router)
app.include_router(verification_router)
app.include_router(claims_router)
app.include_router(getuser_router)