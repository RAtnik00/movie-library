import datetime
from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class RegisterResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime.datetime