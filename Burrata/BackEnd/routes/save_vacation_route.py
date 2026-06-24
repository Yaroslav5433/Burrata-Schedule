from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from schemas.schemas import Vacations
from utils.utils import transform_str_item_to_datetime


save_vacation_router = APIRouter()

@save_vacation_router.post('/savevacation', status_code=status.HTTP_201_CREATED)
async def savevacation(vacation_info: Vacations, db: AsyncSession = Depends(get_db)):

    success_on_req = await db_req.save_vacation_in_database(
        username = vacation_info.username,
        start_date = transform_str_item_to_datetime(vacation_info.start_date),
        end_date = transform_str_item_to_datetime(vacation_info.end_date),
        db = db)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vacation hasn`t been saved",
        )
    
    logger.info('VACATION HAS BEEN SAVED')
    return { 'success' }