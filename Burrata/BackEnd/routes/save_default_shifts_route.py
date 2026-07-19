from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import DefaultShifts

save_default_shifts_router = APIRouter()

@save_default_shifts_router.post('/savedefaultshifts', status_code=status.HTTP_201_CREATED)
async def get_default_shifts(shifts: DefaultShifts, department: str, db: AsyncSession = Depends(get_db)):
    
    success_on_insert = await db_req.save_default_shifts(shifts = shifts, department = department, db = db)  

    if not success_on_insert:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Default shifts haven`t been saved",
        )

    logger.info('Saving default shifts')
    
    return { 'success' }