from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from utils.utils import get_next_week_dates
from schemas.schemas import Users_with_shifts

getclaims_router = APIRouter()

@getclaims_router.get('/getallclaims', response_model = Users_with_shifts)
async def get_claims(department: str, dateStep: int, db: AsyncSession = Depends(get_db)):
    all_claims = await db_req.get_all_users_saved_shifts(
        db = db, 
        requested_position = department, 
        week_dates = get_next_week_dates(steps = dateStep), 
        claims = True)
    
    if not all_claims:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claims not found",
        )

    logger.info('Sending a claims...')
    
    return all_claims