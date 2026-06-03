from pydantic import BaseModel, RootModel

class Login_data(BaseModel):
    login: str
    password: str

class Verification_data(BaseModel):
    unique_id_number: str

class Users(RootModel[dict[str, list[str]]]):
    pass

class Dates(BaseModel):
    dates: list[str]

class Token(BaseModel):
    access_token: str