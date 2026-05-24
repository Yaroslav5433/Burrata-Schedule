from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import get_current_week_days

getuser_router = APIRouter()

@getuser_router.get('/getusersanddates')
async def get_users(db: AsyncSession = Depends(get_db)):
    all_users = await db_req.get_all_users(db)

    if not all_users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Users not found",
        )
    
    logger.info('Users have been found')
    
    return {'all_users': all_users, 'this_week_dates': get_current_week_days(nosql=True)}