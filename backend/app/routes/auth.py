from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.database import get_db
from app.models.user import User
from app.schemas.user import RegisterRequest, RegisterResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register_user(body: RegisterRequest, db: Session = Depends(get_db)):
    stmt = select(User).where(User.username == body.username)
    result = db.execute(stmt)
    existing_username = result.scalar_one_or_none()
    if existing_username is not None:
        raise HTTPException(status_code=400, detail="Username already exists")

    stmt = select(User).where(User.email == body.email)
    result = db.execute(stmt)
    existing_email = result.scalar_one_or_none()
    if existing_email is not None:
        raise HTTPException(status_code=400, detail="Email already exists")

    password_hash = get_password_hash(body.password)
    user = User(
        username=body.username,
        email=body.email,
        password_hash=password_hash,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists")

    return RegisterResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        created_at=user.created_at,
    )