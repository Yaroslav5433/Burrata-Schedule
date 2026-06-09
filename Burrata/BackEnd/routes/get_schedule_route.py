from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Users_with_shifts
from utils.utils import get_next_week_dates, interpret_claims_as_list

getschedule_router = APIRouter()

@getschedule_router.get('/getschedule', response_model = Users_with_shifts)
async def get_schedule(department: str, dateStep: int, db: AsyncSession = Depends(get_db)):
    schedule = await db_req.get_all_users_saved_shifts(
        db, 
        requested_position = department, 
        week_dates = get_next_week_dates(steps = dateStep)
    )

    for username, user_saved_shift in schedule.items():
        schedule[username] = interpret_claims_as_list(
            user_saved_claims = user_saved_shift,
            next_week_dates = get_next_week_dates(nosql = True, steps = dateStep)
        )

    print(schedule)
    logger.info('Sending a schedule...')
    
    return schedule