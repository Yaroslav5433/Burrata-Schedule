from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from utils.utils import transform_date_to_sql
from redis_ import redis_requests as redis_req
from loguru import logger


claims_router = APIRouter()

@claims_router.post('/claims')
async def claimshandler(data: dict, request: Request, db: AsyncSession = Depends(get_db)):

    claims, username = data["values"], data["username"]
    claims_sql_type = transform_date_to_sql(claims)

    if request.app.state.redis_is_connected:
        try:
            await redis_req.insert_claims_in_redis(
                username,
                claims, 
                redis_client=request.app.state.redis)
        except:
            logger.info('Claims havent been inserted in redis')
            request.app.state.redis_is_connected = False
    
    success_on_req = await db_req.insert_claims_in_database(username, claims_sql_type, db)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Claims hasn't been saved",
        )
    
    logger.info('CLAIMS HAS BEEN SAVED')
    return status.HTTP_201_CREATED