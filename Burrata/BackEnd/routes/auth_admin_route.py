from fastapi import APIRouter, HTTPException, Depends, status
from authx import AuthXConfig, AuthX
from loguru import logger
from schemas.schemas import Login_data, Token
from sqlalchemy.ext.asyncio import AsyncSession
from config.config import get_config
from database.database import get_db
from database import database_requests as db_req

global_config = get_config()
login_router = APIRouter()

jwt_config = AuthXConfig()
jwt_config.JWT_SECRET_KEY = global_config.JWT_SECRET_KEY
jwt_config.JWT_ACCESS_COOKIE_NAME = global_config.JWT_ACCESS_COOKIE_NAME
jwt_config.JWT_TOKEN_LOCATION = global_config.JWT_TOKEN_LOCATION

security = AuthX(config=jwt_config)

@login_router.post("/login", response_model=Token)
async def login(login_data: Login_data, db: AsyncSession = Depends(get_db)):
    verified_admin = await db_req.get_admin_for_login(
        login_data = login_data.login,
        db = db) 

    if not verified_admin or not verified_admin.verify_password(password = login_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    token = security.create_access_token(uid = login_data.login)
    logger.info('TOKEN HAS BEEN CREATED')

    return {"access_token": token}