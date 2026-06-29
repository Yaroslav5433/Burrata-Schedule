from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database import database_requests as db_req
from loguru import logger
from schemas.schemas import Vacations

get_vacations_router = APIRouter()

@get_vacations_router.get('/getvacations', status_code=status.HTTP_200_OK, response_model = list[Vacations])
async def getvacations(db: AsyncSession = Depends(get_db)):

    vacations = await db_req.get_vacations(db = db)

    if not vacations: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vacation haven`t been found",
        )
    
    logger.info('VACATIONS HAVE BEEN FOUND')

    return vacations