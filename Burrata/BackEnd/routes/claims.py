from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import get_db
from database.models import ClaimsSchedule, Shifts
from utils.utils import dateToSql, currentWeekDates
from loguru import logger


claims_router = APIRouter()

@claims_router.post('/claims')
async def claimshandler(data: dict, db: AsyncSession = Depends(get_db)):
    claims, username = data["values"], data["username"]
    claimsSqlType = dateToSql(claims)
    res = await db.execute(insert(ClaimsSchedule).values([
        {"date": date, "shift": Shifts(shift), "username": username}
        for date, shift in claimsSqlType.items()
    ]))

    await db.commit()

    if not res: 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Claims hasn't been saved",
        )
    
    logger.info('CLAIMS HAS BEEN SAVED', res)
    return status.HTTP_201_CREATED