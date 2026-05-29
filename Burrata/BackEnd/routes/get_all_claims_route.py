from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import transform_datetime_item_to_str
from schemas.schemas import Many_users_claims

getclaims_router = APIRouter()

@getclaims_router.get('/getallclaims', response_model = Many_users_claims)
async def get_claims(db: AsyncSession = Depends(get_db)):
    all_claims = await db_req.get_all_users_saved_claims(db)

    logger.info('Sending a claims...')
    
    return all_claims