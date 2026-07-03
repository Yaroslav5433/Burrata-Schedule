from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import ShiftsValues

getshiftsvalues_router = APIRouter()

@getshiftsvalues_router.get('/getshiftsvalues', response_model = ShiftsValues)
async def get_shifts_values(username: str, db: AsyncSession = Depends(get_db)):
    
    shiftValues = await db_req.get_shifts_values(
        db = db,
        username = username
    )

    if not shiftValues:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved shift values",
        )

    logger.info('Sending a shiftValues...')
    
    return shiftValues