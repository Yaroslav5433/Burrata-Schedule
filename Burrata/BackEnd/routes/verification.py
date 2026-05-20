from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database.models import Users, ClaimsSchedule
from schemas.schemas import Verification
from utils.utils import currentWeekDates, sqlToNormal
from sqlalchemy import select
from loguru import logger

verification_router = APIRouter()

@verification_router.post('/request')
async def verification(verification_data: Verification, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Users).filter(Users.unique_id_number == verification_data.unique_id_number))
    user = result.scalar_one_or_none()
    if user:
        this_week_days = currentWeekDates()
        user_saved_claims_rows = await db.execute(select(ClaimsSchedule.date, ClaimsSchedule.shift).where(
            ClaimsSchedule.username == user.username,
            ClaimsSchedule.date.in_(this_week_days)
        ))

        user_saved_claims = {
            row["date"]: row["shift"]
            for row in user_saved_claims_rows.mappings()
        }

        user_saved_claims = sqlToNormal(user_saved_claims)

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="USER NOT FOUND",
        )
    
    logger.info('USER HAS BEEN VERIFIED')
    return {'user': user.username, 'user_saved_claims': user_saved_claims, 'dates': currentWeekDates(nosql=True)}