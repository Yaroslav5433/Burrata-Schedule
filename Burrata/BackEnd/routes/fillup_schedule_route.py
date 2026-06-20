from fastapi import APIRouter, Body, HTTPException, status
from loguru import logger
from schemas.schemas import Schedule_ai_response
from schedule_solver.schedule_solver import calculate_schedule

fillup_schedule_router = APIRouter()

@fillup_schedule_router.post('/fillupschedule', response_model = Schedule_ai_response)
def get_users(claims: dict = Body(), demands: dict = Body()):

    res = calculate_schedule(claims = claims, demands = demands)
    
    if res['status'] == "failed":
        logger.info('Schedule hasn`t been calculated')
        logger.info(f'res: {res}')

        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail = res["reason"]
        )

    logger.info('Schedule has been calculated')

    logger.info(f'res: {res}')
    
    return res