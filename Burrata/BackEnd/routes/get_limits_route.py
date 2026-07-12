from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from database.database import get_db
from database import database_requests as db_req
from utils.utils import calculate_limits, get_next_week_dates, vacation_to_dict

get_limits_router = APIRouter()

@get_limits_router.get('/getlimits')
async def get_limits(username: str, db: AsyncSession = Depends(get_db)):
    
    depart = await db_req.get_user_depart(username = username, db = db)
    all_users = await db_req.get_all_users(requested_department = depart, db = db, include_trainee = False)  
    default_shifts = await db_req.get_default_shifts(db = db)
    all_claims = await db_req.get_all_users_saved_shifts(
        week_dates = get_next_week_dates(),
        requested_position = depart,
        claims = True,
        db = db)
    vacations = await db_req.get_vacations(db = db)

    limits = calculate_limits(
        all_users = len(all_users.keys()),
        default_shifts = default_shifts,
        all_claims = all_claims,
        all_vacations = vacation_to_dict(vacations))

    logger.info(f'Sendind limits {limits}')
    
    return limits