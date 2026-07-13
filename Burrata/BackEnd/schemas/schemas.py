from .base_api_model import APIModel
from datetime import datetime

class Login_data(APIModel):
    login: str
    password: str

class Verification_data(APIModel):
    unique_id_number: str

class Messages(APIModel):
    username: str
    message: str
    created_at: datetime
    id: int

class Vacations(APIModel):
    id: str
    user_id: str
    start_date: datetime
    end_date: datetime

class Users_with_shifts_and_message(APIModel):
    user_id: int
    username: str
    claims: dict | None
    message: str | None

class Users_with_shifts(APIModel):
    user_id: int
    shifts: dict

class Users(APIModel):
    user_id: str
    username: str
    unique_id_number: int
    department: str
    is_trainee: bool

class Schedule_ai_response(APIModel):
    status: str
    schedule: dict[str, list] | None
    reason: str | None

class Dates(APIModel):
    dates: list[str]

class Token(APIModel):
    access_token: str

class User(APIModel):
    username: str
    is_trainee: bool
    department: str
    unique_id_number: str

class AllowedShiftsValues(APIModel):
    day: str
    shifts: list[dict]

class MaxShiftsWeekTotal(APIModel):
    limits: dict[str, int]

class UserSettings(APIModel):
    user_id: str
    totalMaxShifts: dict
    availableShiftsValues: dict

class FillUpInfo(APIModel):
    claims: dict
    demands: dict
    dates: list
    only_long: list
    only_short: list

class DefaultShifts(APIModel):
    Monday: str
    Tuesday: str
    Wednesday: str
    Thursday: str
    Friday: str
    Saturday: str
    Sunday: str
