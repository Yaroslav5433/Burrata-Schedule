from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import DefaultShifts

get_default_shifts_router = APIRouter()

@get_default_shifts_router.get('/getdefaultshifts', response_model = DefaultShifts)
async def get_default_shifts(department: str, db: AsyncSession = Depends(get_db)):
    
    default_shifts = await db_req.get_default_shifts(department = department, db = db)  

    if not default_shifts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No default shifts",
        )

    logger.info('Sendind default shifts')
    
    return default_shifts