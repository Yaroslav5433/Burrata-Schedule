from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from utils.utils import prepare_shifts_for_sql_insert, get_next_week_dates
from schemas.schemas import Users_with_shifts_and_message
from loguru import logger


claims_router = APIRouter()

@claims_router.post('/saveuserclaims', status_code=status.HTTP_201_CREATED)
async def claimshandler(user_claims_to_save: Users_with_shifts_and_message, db: AsyncSession = Depends(get_db)):

    claims_sql_type = prepare_shifts_for_sql_insert(
        shifts = user_claims_to_save.claims,
        next_week_dates = get_next_week_dates())
    
    success_on_shifts_insert = await db_req.insert_shifts_in_database(
        username = user_claims_to_save.username,
        claims_sql_type = claims_sql_type,
        db = db,
        claims = True)
    
    if user_claims_to_save.message:
        success_on_message_insert = await db_req.insert_message(
        username = user_claims_to_save.username,
        message = user_claims_to_save.message,
        db = db
    )

    if not success_on_shifts_insert and success_on_message_insert: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Claims hasn't been saved",
        )
    
    logger.info('CLAIMS HAS BEEN SAVED')
    return { 'success' }