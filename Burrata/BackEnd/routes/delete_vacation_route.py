from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger

delete_vacation_route = APIRouter()

@delete_vacation_route.delete('/deletevacation', status_code=status.HTTP_204_NO_CONTENT)
async def delete_vacation(username: str, db: AsyncSession = Depends(get_db)):
    success_on_deleting = await db_req.delete_vacation(username = username, db = db)

    if not success_on_deleting:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Vacations not found",
        )
    
    logger.info('Vacation has been deleted')