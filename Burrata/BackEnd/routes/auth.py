from fastapi import APIRouter, HTTPException, Depends, status
from authx import AuthXConfig, AuthX
from loguru import logger
from schemas.auth import LoginRequest
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from config.config import get_config
from database.database import get_db
from database.models import Admin

global_config = get_config()
login_router = APIRouter()

jwt_config = AuthXConfig()
jwt_config.JWT_SECRET_KEY = global_config.JWT_SECRET_KEY
jwt_config.JWT_ACCESS_COOKIE_NAME = global_config.JWT_ACCESS_COOKIE_NAME
jwt_config.JWT_TOKEN_LOCATION = global_config.JWT_TOKEN_LOCATION

security = AuthX(config=jwt_config)

@login_router.post("/login")
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Admin).filter(Admin.login == login_data.login))
    admin = result.scalar_one_or_none()

    if not admin or not admin.verify_password(login_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    token = security.create_access_token
    logger.info('TOKEN HAS BEEN CREATED')
    return {"access_token": token}