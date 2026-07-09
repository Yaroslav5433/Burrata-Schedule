from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import MaxShiftsWeekTotal

gettotalmax_router = APIRouter()

@gettotalmax_router.get('/gettotalmax', response_model = MaxShiftsWeekTotal)
async def get_shifts_values(username: str, db: AsyncSession = Depends(get_db)):
    
    max_shift_week_total = await db_req.get_max_shift_week_total(
        db = db,
        username = username
    )

    if not max_shift_week_total:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved total values",
        )

    logger.info('Sending a total...')
    
    return max_shift_week_total