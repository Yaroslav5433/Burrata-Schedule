from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger

deleteuser_router = APIRouter()

@deleteuser_router.delete('/deleteuser', status_code=status.HTTP_204_NO_CONTENT)
async def get_users(username: str, db: AsyncSession = Depends(get_db)):
    success_on_deleting = await db_req.delete_user_by_name(username, db)

    if not success_on_deleting:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Users not found",
        )
    
    logger.info('User has been deleted')
    
    return { 'success' }