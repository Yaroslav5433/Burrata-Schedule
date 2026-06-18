from pydantic import BaseModel, RootModel

class Login_data(BaseModel):
    login: str
    password: str

class Verification_data(BaseModel):
    unique_id_number: str

class Users_with_shifts(RootModel[dict[str, list[str]]]):
    pass

class Users_with_info(RootModel[dict[str, dict]]):
    pass

class Schedule_ai_response(BaseModel):
    status: str
    schedule: dict[str, list] | None
    reason: str | None

class Dates(BaseModel):
    dates: list[str]

class Token(BaseModel):
    access_token: str