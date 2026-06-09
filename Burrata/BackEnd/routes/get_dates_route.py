from fastapi import APIRouter, Body
from loguru import logger
from schemas.schemas import Dates
from utils.utils import get_next_week_dates

getdates_router = APIRouter()

@getdates_router.post('/getdates', response_model = Dates)
def get_users(dateStep: int = Body(0)):
    dates = get_next_week_dates(nosql = True, steps = dateStep)
    
    logger.info('Dates have been calculated')
    
    return {'dates': dates}