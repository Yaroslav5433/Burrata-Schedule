from fastapi import APIRouter, Depends, HTTPException, status
from schemas.schemas import VerificationRequest
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database.models import Users
from sqlalchemy import select
from loguru import logger

verification_router = APIRouter()

@verification_router.post('/request')
async def verification(verification_data: VerificationRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Users).filter(Users.unique_id_number == verification_data.unique_id_number))
    user = result.scalar_one_or_none()

    if not user: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="USER NOT FOUND",
        )
    
    logger.info('USER HAS BEEN VERIFIED')
    return {'user': user.username}