from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger

check_message_router = APIRouter()

@check_message_router.post('/checkmessage', status_code=status.HTTP_200_OK)
async def check_message(id: int = Body(), db: AsyncSession = Depends(get_db)):
    success_on_check = await db_req.check_message_as_read(id = id, db = db)

    if not success_on_check:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed during check as read",
        )
    
    logger.info('Message has been checked as read')