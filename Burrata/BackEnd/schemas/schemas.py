from pydantic import BaseModel

class LoginRequest(BaseModel):
    login: str
    password: str

class VerificationRequest(BaseModel):
    unique_id_number: str