from fastapi import APIRouter, Body, HTTPException, status
from loguru import logger
from schemas.schemas import Schedule_ai_response
from AI.ai_requests import create_schedule
from AI.prompts import schedule_prompt

fillup_schedule_router = APIRouter()

@fillup_schedule_router.post('/fillupschedule', response_model = Schedule_ai_response)
def get_users(claims: dict = Body(), demands: dict = Body()):

    res = create_schedule(claims = claims, demands = demands, schedule_prompt = schedule_prompt)
    
    if res["status"] == "failed":
        logger.info('Schedule hasn`t been calculated')
        logger.info(f'res: {res}')

        raise HTTPException(
            status_code = status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail = res["reason"]
        )

    logger.info('Schedule has been calculated')

    logger.info(f'res: {res}')
    
    return res