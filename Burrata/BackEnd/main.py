from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from authx import AuthX, AuthXConfig

config = AuthXConfig()
config.JWT_SECRET_KEY = "SECRET_KEY"
config.JWT_ACCESS_COOKIE_NAME = "MY_ACCESS_TOKEN"
config.JWT_TOKEN_LOCATION = ['cookies']

security = AuthX(config=config)

app = FastAPI()

class User(BaseModel):
    login: str
    password: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/login")
async def initialize(user: User):
    if user.login == '123' and user.password == '123':
        token = security.create_access_token
        return {"access_token": token}
    raise HTTPException(status_code=401, detail='Incorrect username or password')


    