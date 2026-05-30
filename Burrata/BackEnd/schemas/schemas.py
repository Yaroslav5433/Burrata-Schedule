from pydantic import BaseModel, Field

class Login_data(BaseModel):
    login: str
    password: str

class Verification_data(BaseModel):
    unique_id_number: str

class One_user_claims(BaseModel):
    username: str
    claims: list[str]

class Many_users_claims(BaseModel):
    root: dict[str, list[str]]

class All_users(BaseModel):
    users: dict[str, list[str]]

class Dates(BaseModel):
    dates: list[str]

class Token(BaseModel):
    access_token: str