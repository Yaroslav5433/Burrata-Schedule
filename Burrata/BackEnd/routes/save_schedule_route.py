from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from datetime import datetime
from loguru import logger


save_schedule_router = APIRouter()

@save_schedule_router.post('/saveschedule', status_code=status.HTTP_201_CREATED)
async def save_schedule(schedule: list[dict[datetime, str]], db: AsyncSession = Depends(get_db)):
    
    success_on_req = await db_req.save_all_shifts(
        shifts = schedule,
        db = db)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Claims hasn't been saved",
        )
    
    logger.info('SCHEDULE HAS BEEN SAVED')
    return { 'success' }