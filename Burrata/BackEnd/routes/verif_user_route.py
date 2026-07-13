from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Verification_data, Users_with_shifts_and_message
from utils.utils import get_next_week_dates, interpret_claims_as_list, get_this_monday
from loguru import logger

verification_router = APIRouter()

@verification_router.post('/verifyuser', response_model = Users_with_shifts_and_message)
async def verification(verification_data: Verification_data, db: AsyncSession = Depends(get_db)):
    verified_user = await db_req.get_user_by_id(verification_data.unique_id_number, db)

    if verified_user:
        user_saved_claims = await db_req.get_user_saved_claims(
            verified_user = verified_user,
            next_week_dates = get_next_week_dates(),
            db = db)
        
        claims_as_list = interpret_claims_as_list(
            user_saved_claims = user_saved_claims,
            next_week_dates = get_next_week_dates(nosql = True)) 
        
        user_message = await db_req.get_user_message(
            username = verified_user.username,
            date = get_this_monday(),
            db = db
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="USER NOT FOUND",
        )
    
    logger.info('USER HAS BEEN VERIFIED')

    return { 
        'username': verified_user.username,
        'claims': claims_as_list,
        'message': user_message }