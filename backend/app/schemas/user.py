import datetime
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class RegisterResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
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

class MovieActionRequest(BaseModel):
    tmdb_id: int

class WatchedMovieInfo(BaseModel):
    id: int
    tmdb_id: int
    title: str
    poster_path: str | None

    class Config:
        from_attributes = True

class SetWatchedRatingRequest(BaseModel):
    rating: int = Field(ge=1, le=10)

class WatchedResponse(BaseModel):
    id: int
    movie_id: int
    rating: int | None
    created_at: datetime.datetime
    movie: WatchedMovieInfo

    class Config:
        from_attributes = True