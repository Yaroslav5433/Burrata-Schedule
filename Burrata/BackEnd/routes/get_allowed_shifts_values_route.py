from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import ShiftsValues

getallowedshiftsvalues_router = APIRouter()

@getallowedshiftsvalues_router.get('/getallowedshiftsvalues', response_model = ShiftsValues)
async def get_allowed_shifts_values(username: str, db: AsyncSession = Depends(get_db)):
    
    allowed_shifts_values = await db_req.get_shifts_values(
        db = db,
        username = username
    )

    if not allowed_shifts_values:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved shift values",
        )

    logger.info('Sending an allowed shift values...')
    
    return allowed_shifts_values