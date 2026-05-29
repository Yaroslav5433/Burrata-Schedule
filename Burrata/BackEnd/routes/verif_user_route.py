from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Verification_data, One_user_claims
from utils.utils import get_next_week_dates
from loguru import logger
from redis_ import redis_requests as redis_req
import time

t0 = time.time()

verification_router = APIRouter()

@verification_router.post('/request', response_model = One_user_claims)
async def verification(verification_data: Verification_data, request: Request, db: AsyncSession = Depends(get_db)):
    verified_user = await db_req.get_user_by_id(verification_data.unique_id_number, db)

    if verified_user:
        this_week_days = get_next_week_dates()
        if request.app.state.redis_is_connected:
            try:
                user_saved_claims = await redis_req.get_claims_from_redis(verified_user.username, redis_client=request.app.state.redis)
                logger.info('data has been taken from redis')
            except:
                request.app.state.redis_is_connected = False
                user_saved_claims = await db_req.get_user_saved_claims(verified_user, this_week_days, db)
                logger.info('data has been taken from sql after redis dissconnects')
        else:
            user_saved_claims = await db_req.get_user_saved_claims(verified_user, this_week_days, db)
            logger.info('data has been taken from sql')
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="USER NOT FOUND",
        )
    
    logger.info('USER HAS BEEN VERIFIED')

    return {'username': verified_user.username, 
            'user_saved_claims': user_saved_claims}