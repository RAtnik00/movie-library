from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginResponse,
    RefreshTokenRequest,
    LogoutRequest,
    UpdateAvatarRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register_user(body: RegisterRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register(body)


@router.post("/login", response_model=LoginResponse, status_code=200)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.login(form_data.username, form_data.password)


@router.post("/logout")
def logout_user(body: LogoutRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.logout(body.refresh_token)


@router.post("/refresh")
def refresh_token(body: RefreshTokenRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.refresh(body.refresh_token)


@router.patch("/avatar", response_model=RegisterResponse)
def update_avatar(
    body: UpdateAvatarRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = AuthService(db)
    user = service.update_avatar(current_user, body.avatar_url)

    return RegisterResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        birth_date=user.birth_date,
        created_at=user.created_at,
        avatar_url=user.avatar_url,
    )


@router.get("/me", response_model=RegisterResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return RegisterResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        birth_date=current_user.birth_date,
        created_at=current_user.created_at,
        avatar_url=current_user.avatar_url,
    )
