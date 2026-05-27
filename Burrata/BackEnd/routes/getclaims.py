from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import sql_datetime_to_str

getclaims_router = APIRouter()

@getclaims_router.get('/getallclaims')
async def get_claims(db: AsyncSession = Depends(get_db)):
    all_claims = await db_req.get_all_users_claims(db)

    logger.info('Sending a claims...')
    
    return [
        {
            "username": username,
            "date": sql_datetime_to_str(date),
            "shift": shift
        }
        for username, date, shift in all_claims]