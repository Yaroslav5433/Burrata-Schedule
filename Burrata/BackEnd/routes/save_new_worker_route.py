from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from schemas.schemas import User


save_new_worker = APIRouter()

@save_new_worker.post('/savenewworker', status_code=status.HTTP_201_CREATED)
async def allclaimshandler(user_info: User, request: Request, db: AsyncSession = Depends(get_db)):

    print(f'All staff that i need: {user_info}')

    success_on_req = await db_req.insert_users_in_database(
        username = User.username,
        position = User.position,
        is_trainee = User.is_trainee,
        unique_id_number = User.unique_id_number,
        db = db)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User hasn't been saved",
        )
    
    logger.info('USER HAS BEEN SAVED')
    return { 'success' }