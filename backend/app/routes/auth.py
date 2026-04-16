from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, get_current_user, create_access_token, verify_password
from app.database import get_db
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import RegisterRequest, RegisterResponse, LoginResponse, RefreshTokenRequest, LogoutRequest

from app.core.security import create_refresh_token, hash_token

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

@router.post("/login", response_model=LoginResponse, status_code=200)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    stmt = select(User).where(
        or_(User.username == form_data.username, User.email == form_data.username)
    )
    result = db.execute(stmt)
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token()
    refresh_token_hash = hash_token(refresh_token)

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    new_token_entry = RefreshToken(
        user_id=user.id,
        token_hash=refresh_token_hash,
        expires_at=expires_at,
    )

    db.add(new_token_entry)
    db.commit()
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
    )

@router.post("/logout")
def logout_user(body: LogoutRequest, db: Session = Depends(get_db)):
    token_hash = hash_token(body.refresh_token)
    stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    result = db.execute(stmt)
    token_entry = result.scalar_one_or_none()
    if token_entry is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    if token_entry.revoked_at is not None:
        raise HTTPException(status_code=401, detail="Token already revoked")

    token_entry.revoked_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Logged out"}


@router.post("/refresh")
def refresh_token(body: RefreshTokenRequest, db: Session = Depends(get_db)):
    token_hash = hash_token(body.refresh_token)

    stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    token_entry = db.execute(stmt).scalar_one_or_none()

    if token_entry is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    if token_entry.revoked_at is not None:
        raise HTTPException(status_code=401, detail="Refresh token revoked")

    if token_entry.expires_at < datetime.now():
        raise HTTPException(status_code=401, detail="Refresh token expired")

    access_token = create_access_token(data={"sub": str(token_entry.user_id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get("/me", response_model=RegisterResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return RegisterResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
    )
