import datetime

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    birth_date: datetime.date


class RegisterResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    birth_date: datetime.date | None
    created_at: datetime.datetime
    avatar_url: str | None


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


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirmRequest(BaseModel):
    token: str
    new_password: str


class UpdateAvatarRequest(BaseModel):
    avatar_url: str