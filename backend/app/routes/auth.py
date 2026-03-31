import datetime

from fastapi import APIRouter, Depends
from app.schemas.user import RegisterRequest, RegisterResponse
from app.models.user import User
from app.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterResponse)
def register_user(body: RegisterRequest):
    return RegisterResponse(
        id=1,
        username=body.username,
        email=body.email,
        created_at=datetime.datetime.utcnow(),

    )