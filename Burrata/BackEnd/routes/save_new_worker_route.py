from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from schemas.schemas import User
from utils.utils import get_basic_shifts, get_basic_totals


save_new_worker = APIRouter()

@save_new_worker.post('/savenewworker', status_code=status.HTTP_201_CREATED)
async def allclaimshandler(user_info: User, db: AsyncSession = Depends(get_db)):

    success_on_req = await db_req.insert_users_in_database(
        username = user_info.username,
        position = user_info.position,
        is_trainee = user_info.is_trainee,
        unique_id_number = user_info.unique_id_number,
        basic_shifts = get_basic_shifts(user_info.position),
        basic_totals = get_basic_totals(user_info.position),
        db = db)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User hasn't been saved",
        )
    
    logger.info('USER HAS BEEN SAVED')
    return { 'success' }