from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from utils.utils import prepare_shifts_for_sql_insert, get_next_week_dates
from redis_ import redis_requests as redis_req
from schemas.schemas import Users
from loguru import logger


claims_router = APIRouter()

@claims_router.post('/saveuserclaims', status_code=status.HTTP_201_CREATED)
async def claimshandler(user_claims_to_save: Users, request: Request, db: AsyncSession = Depends(get_db)):

    claims_sql_type = prepare_shifts_for_sql_insert(shifts = list(user_claims_to_save.root.values())[0], next_week_dates = get_next_week_dates())

    if request.app.state.redis_is_connected:
        try:
            await redis_req.insert_claims_in_redis(
                list(user_claims_to_save.root.keys())[0],
                list(user_claims_to_save.root.values())[0], 
                redis_client=request.app.state.redis)
        except:
            logger.info('Claims havent been inserted in redis')
            request.app.state.redis_is_connected = False
    
    success_on_req = await db_req.insert_shifts_in_database(list(user_claims_to_save.root.keys())[0], claims_sql_type, db, claims = True)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Claims hasn't been saved",
        )
    
    logger.info('CLAIMS HAS BEEN SAVED')
    return { 'success' }