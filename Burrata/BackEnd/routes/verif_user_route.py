from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from schemas.schemas import Verification_data, Users_with_shifts_and_message
from utils.utils import get_next_week_dates, get_this_monday
from loguru import logger

verification_router = APIRouter()

@verification_router.post('/verifyuser', response_model = Users_with_shifts_and_message)
async def verification(verification_data: Verification_data, db: AsyncSession = Depends(get_db)):
    verified_user = await db_req.get_user(
        unique_id_number = verification_data.unique_id_number,
        db = db)

    if verified_user:
        user_saved_claims = await db_req.get_user_saved_claims(
            verified_user = verified_user,
            next_week_dates = get_next_week_dates(),
            db = db
        )
        
        user_saved_message = await db_req.get_user_message(
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
        'user_id': verified_user.id,
        'username': verified_user.username,
        'claims': user_saved_claims,
        'message': user_saved_message }