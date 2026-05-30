from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import get_next_week_dates, interpret_claims_as_list
from schemas.schemas import Many_users_claims

getclaims_router = APIRouter()

@getclaims_router.get('/getallclaims', response_model = Many_users_claims)
async def get_claims(db: AsyncSession = Depends(get_db)):
    all_claims = await db_req.get_all_users_saved_claims(db)
    
    all_claims_lists = interpret_claims_as_list(
        all_claims, 
        next_week_dates = get_next_week_dates(nosql = True), 
        more_than_one_user = True)

    logger.info('Sending a claims...')
    
    return all_claims_lists