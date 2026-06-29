from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Messages

get_messages_router = APIRouter()

@get_messages_router.get('/getmessages', response_model = list[Messages])
async def get_messages(department: str, all: bool, page: int, number_of_elements: int, db: AsyncSession = Depends(get_db)):
    
    logger.info(f'Depart: {department}')
    messages = await db_req.get_messages(
        db = db,
        department = department,
        all = all,
        page = page,
        number_of_elements = number_of_elements)    

    if not messages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved messages",
        )

    logger.info(f'Sending a messages: {messages}')
    
    return messages