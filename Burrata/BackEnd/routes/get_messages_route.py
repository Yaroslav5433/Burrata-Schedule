from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Messages

get_messages_router = APIRouter()

@get_messages_router.get('/getmessages', response_model = list[Messages])
async def get_messages(all: bool, page: int, number_of_elements: int, db: AsyncSession = Depends(get_db)):
    
    messages = await db_req.get_messages(
        db = db,
        all = all,
        page = page,
        number_of_elements = number_of_elements)    

    if not messages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved messages",
        )

    logger.info('Sending a messages')
    
    return messages