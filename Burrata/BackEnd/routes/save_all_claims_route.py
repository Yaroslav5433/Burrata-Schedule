from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from utils.utils import prepare_shifts_for_sql_insert, get_next_week_dates
from schemas.schemas import Users_with_shifts
from loguru import logger


all_claims_router = APIRouter()

@all_claims_router.post('/saveallusersclaims', status_code=status.HTTP_201_CREATED)
async def allclaimshandler(user_claims_to_save: Users_with_shifts, dateStep: int, request: Request, db: AsyncSession = Depends(get_db)):

    for username, shifts in user_claims_to_save.root.items():
        claims_sql_type = prepare_shifts_for_sql_insert(
            shifts = shifts,
            next_week_dates = get_next_week_dates(steps = dateStep))
        
        if not claims_sql_type:
            continue
    
        success_on_req = await db_req.insert_shifts_in_database(
            username,
            claims_sql_type,
            db)

        if not success_on_req: 
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Claims hasn't been saved",
            )
    
    logger.info('CLAIMS HAS BEEN SAVED')
    return { 'success' }