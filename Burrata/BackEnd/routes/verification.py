from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Verification
from utils.utils import get_current_week_days, transform_date_and_shift_from_sql_to_str, transfrom_row_sql_to_dict
from loguru import logger
from redis_ import redis_requests as redis_req

verification_router = APIRouter()

@verification_router.post('/request')
async def verification(verification_data: Verification, request: Request, db: AsyncSession = Depends(get_db)):
    verified_user = await db_req.get_user_by_id(verification_data.unique_id_number, db)

    if verified_user:
        this_week_days = get_current_week_days()
        try:
            user_saved_claims = await redis_req.get_claims_from_redis(verified_user.username, redis_client=request.app.state.redis)
            logger.info('data has been taken from redis')
        except:
            user_saved_claims_rows = await db_req.get_users_saved_claims(verified_user, this_week_days, db)
            user_saved_claims_date_type = transfrom_row_sql_to_dict(user_saved_claims_rows)
            user_saved_claims = transform_date_and_shift_from_sql_to_str(user_saved_claims_date_type)
            logger.info('data has been taken from sql')
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="USER NOT FOUND",
        )
    
    logger.info('USER HAS BEEN VERIFIED')

    return {'user': verified_user.username, 
            'user_saved_claims': user_saved_claims, 
            'dates': get_current_week_days(nosql=True)}