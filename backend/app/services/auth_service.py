from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    get_password_hash,
    create_access_token,
    verify_password,
    create_refresh_token,
    hash_token,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import RegisterRequest, RegisterResponse, LoginResponse
from app.repositories.user_repository import UserRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repository = UserRepository(db)
        self.refresh_token_repository = RefreshTokenRepository(db)

    def register(self, body: RegisterRequest) -> RegisterResponse:
        existing_username = self.user_repository.get_by_username(body.username)
        if existing_username is not None:
            raise HTTPException(status_code=400, detail="Username already exists")

        existing_email = self.user_repository.get_by_email(body.email)
        if existing_email is not None:
            raise HTTPException(status_code=400, detail="Email already exists")

        password_hash = get_password_hash(body.password)
        user = User(
            username=body.username,
            email=body.email,
            password_hash=password_hash,
            birth_date=body.birth_date,
        )

        try:
            self.user_repository.add(user)
            self.db.commit()
            self.db.refresh(user)
        except IntegrityError:
            self.db.rollback()
            raise HTTPException(status_code=400, detail="Username or email already exists")

        return RegisterResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            birth_date=user.birth_date,
            created_at=user.created_at,
            avatar_url=user.avatar_url,
        )

    def update_avatar(self, user: User, avatar_url: str) -> User:
        user.avatar_url = avatar_url
        self.db.commit()
        self.db.refresh(user)
        return user

    def login(self, username_or_email: str, password: str) -> LoginResponse:
        user = self.user_repository.get_by_username_or_email(username_or_email)

        if user is None:
            raise HTTPException(status_code=400, detail="Invalid credentials")

        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=400, detail="Invalid credentials")

        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token()
        refresh_token_hash = hash_token(refresh_token)

        expires_at = self._utc_now() + timedelta(days=7)

        new_token_entry = RefreshToken(
            user_id=user.id,
            token_hash=refresh_token_hash,
            expires_at=expires_at,
        )

        self.refresh_token_repository.add(new_token_entry)
        self.db.commit()

        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    def logout(self, refresh_token: str) -> dict:
        token_hash = hash_token(refresh_token)
        token_entry = self.refresh_token_repository.get_by_token_hash(token_hash)

        if token_entry is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        if token_entry.revoked_at is not None:
            raise HTTPException(status_code=401, detail="Token already revoked")

        token_entry.revoked_at = self._utc_now()
        self.db.commit()

        return {"message": "Logged out"}

    def refresh(self, refresh_token: str) -> dict:
        token_hash = hash_token(refresh_token)
        token_entry = self.refresh_token_repository.get_by_token_hash(token_hash)

        if token_entry is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        if token_entry.revoked_at is not None:
            raise HTTPException(status_code=401, detail="Refresh token revoked")

        expires_at = self._to_naive_utc(token_entry.expires_at)
        if expires_at < self._utc_now():
            raise HTTPException(status_code=401, detail="Refresh token expired")

        access_token = create_access_token(data={"sub": str(token_entry.user_id)})

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }

    def _utc_now(self) -> datetime:
        return datetime.now(timezone.utc).replace(tzinfo=None)

    def _to_naive_utc(self, value: datetime) -> datetime:
        if value.tzinfo is None:
            return value

        return value.astimezone(timezone.utc).replace(tzinfo=None)
