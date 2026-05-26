import datetime

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
<<<<<<< HEAD
    birth_date: datetime.date
=======
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7


class RegisterResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
<<<<<<< HEAD
    birth_date: datetime.date | None
=======
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7
    created_at: datetime.datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class LogoutRequest(BaseModel):
    refresh_token: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str
<<<<<<< HEAD


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str
=======
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7
