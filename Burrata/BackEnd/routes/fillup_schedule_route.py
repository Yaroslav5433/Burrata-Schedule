from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger
from schemas.schemas import Schedule_ai_response, FillUpInfo
from database.database import get_db
from schedule_solver.schedule_solver import calculate_schedule
from database import database_requests as db_req
from utils.utils import get_two_days_before, merge_to_nine_days

fillup_schedule_router = APIRouter()

@fillup_schedule_router.post('/fillupschedule', response_model = Schedule_ai_response)
async def get_users(fill_up_info: FillUpInfo, db: AsyncSession = Depends(get_db)):

    two_days_claims = await db_req.get_all_users_saved_shifts(
        db = db, 
        requested_position = 'service', 
        week_dates = get_two_days_before(date_str = fill_up_info.dates[0]), 
        claims = True)

    nine_days_claims = merge_to_nine_days(
        seven_days_claims = fill_up_info.claims, 
        two_days_claims = two_days_claims)

    res = calculate_schedule(claims = nine_days_claims, demands = fill_up_info.demands)
    
    if res['status'] == "failed":
        logger.info('Schedule hasn`t been calculated')
        logger.info(f'res: {res}')

        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail = res["reason"]
        )

    logger.info('Schedule has been calculated')

    logger.info(f'res: {res}')
    
    return res