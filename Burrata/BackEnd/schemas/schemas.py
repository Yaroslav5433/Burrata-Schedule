from pydantic import BaseModel, RootModel
from datetime import datetime

class Login_data(BaseModel):
    login: str
    password: str

class Verification_data(BaseModel):
    unique_id_number: str

class Messages(BaseModel):
    username: str
    message: str
    created_at: datetime
    id: int

class Vacations(BaseModel):
    username: str
    start_date: datetime
    end_date: datetime

class Users_with_shifts_and_message(BaseModel):
    username: str
    claims: list[str]
    message: str | None

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

class User(BaseModel):
    username: str
    is_trainee: bool
    position: str
    unique_id_number: str

class ShiftsValues(RootModel[dict[str, dict]]):
    pass

class MaxShiftsWeekTotal(RootModel[dict[str, int]]):
    pass

class UserSettings(BaseModel):
    username: str
    totalMaxShifts: dict
    availableShiftsValues: dict

class FillUpInfo(BaseModel):
    claims: dict
    demands: dict
    dates: list