from fastapi import APIRouter, HTTPException
from authx import AuthXConfig, AuthX
from loguru import logger

from config.config import get_config

global_config = get_config()
login_router = APIRouter

jwt_config = AuthXConfig()
jwt_config.JWT_SECRET_KEY = global_config.JWT_SECRET_KEY
jwt_config.JWT_ACCESS_COOKIE_NAME = global_config.JWT_ACCESS_COOKIE_NAME
jwt_config.JWT_TOKEN_LOCATION = global_config.JWT_TOKEN_LOCATION

security = AuthX(config=jwt_config)

@login_router.post(global_config.WEBHOOK_PATH)
async def initialize(user):
    if user.login == '123' and user.password == '123':
        token = security.create_access_token
        logger.info('TOKEN HAS BEEN CREATED')
        return {"access_token": token}
    raise HTTPException(status_code=401, detail='Incorrect username or password')
