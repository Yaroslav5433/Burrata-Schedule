from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import get_next_week_dates, interpret_claims_as_list
from schemas.schemas import Users_with_shifts

getclaims_router = APIRouter()

@getclaims_router.get('/getallclaims', response_model = Users_with_shifts)
async def get_claims(department: str, db: AsyncSession = Depends(get_db)):
    all_claims = await db_req.get_all_users_saved_shifts(db, requested_position = department, week_dates = get_next_week_dates(), claims = True)

    for username, user_saved_claims in all_claims.items():
        all_claims[username] = interpret_claims_as_list(user_saved_claims = user_saved_claims, next_week_dates = get_next_week_dates(nosql = True))

    print(all_claims)
    logger.info('Sending a claims...')
    
    return all_claims