from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from BackEnd.routes.auth import login_router
from BackEnd.routes.health import health_router
from loguru import logger
from config.config import get_config

global_config = get_config()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting application")

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