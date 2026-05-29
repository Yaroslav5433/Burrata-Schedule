from pydantic import BaseModel

class Login_data(BaseModel):
    login: str
    password: str

class Verification_data(BaseModel):
    unique_id_number: str

class One_user_claims(BaseModel):
    username: str
    claims: dict

class Many_users_claims(BaseModel):
    username: str
    claims: list[dict]

class All_users(BaseModel):
    users: list[str]

class Dates(BaseModel):
    dates: list[str]

class Token(BaseModel):
    access_token: str