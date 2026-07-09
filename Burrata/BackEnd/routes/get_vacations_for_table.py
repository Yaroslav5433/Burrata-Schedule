from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import vacations_to_week, get_next_week_dates
from schemas.schemas import Users_with_shifts

get_vacations_for_table_router = APIRouter()

@get_vacations_for_table_router.get('/getvacationstable', response_model = Users_with_shifts)
async def get_claims(dateStep: int, db: AsyncSession = Depends(get_db)):
    all_vacations = await db_req.get_vacations(db = db)

    all_vacations_table_type = vacations_to_week(vacations = all_vacations, dates = get_next_week_dates(steps = dateStep))

    logger.info('Sending a vacations...')
    
    return all_vacations_table_type