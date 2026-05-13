from fastapi import APIRouter
from loguru import logger

health_router = APIRouter()

@health_router.get("/health")
async def health_check():
    logger.info("Health check endpoint called")
    return {"status": "healthy"}