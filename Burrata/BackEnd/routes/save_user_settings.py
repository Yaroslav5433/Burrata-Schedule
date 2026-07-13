from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from schemas.schemas import UserSettings


save_user_settings_router = APIRouter()

@save_user_settings_router.post('/saveusersettings', status_code=status.HTTP_201_CREATED)
async def allclaimshandler(settings: UserSettings, db: AsyncSession = Depends(get_db)):

    success_on_req = await db_req.save_user_settings(
        user_id = settings.user_id,
        available_shifts_values = settings.availableShiftsValues,
        total_max_shifts = settings.totalMaxShifts,
        db = db)

    if not success_on_req: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Settings haven't been saved",
        )
    
    logger.info('SETTINGS HAVE BEEN SAVED')
    
    return { 'success' }