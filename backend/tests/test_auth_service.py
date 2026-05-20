from datetime import date, datetime, timedelta, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

import app.services.auth_service as auth_module
from app.core.security import decode_access_token, get_password_hash, hash_token
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.services.auth_service import AuthService


class FakeUserRepository:
    def __init__(
        self,
        username_user=None,
        email_user=None,
        username_or_email_user=None,
    ):
        self.username_user = username_user
        self.email_user = email_user
        self.username_or_email_user = username_or_email_user
        self.added_user = None

    def get_by_username(self, username: str):
        return self.username_user

    def get_by_email(self, email: str):
        return self.email_user

    def get_by_username_or_email(self, username_or_email: str):
        return self.username_or_email_user

    def add(self, user: User) -> None:
        self.added_user = user


class FakeRefreshTokenRepository:
    def __init__(self, token_entry=None):
        self.token_entry = token_entry
        self.added_token = None

    def get_by_token_hash(self, token_hash: str):
        return self.token_entry

    def add(self, refresh_token) -> None:
        self.added_token = refresh_token


class FakeDb:
    def __init__(self):
        self.committed = False
        self.rolled_back = False
        self.refreshed_obj = None

    def commit(self) -> None:
        self.committed = True

    def rollback(self) -> None:
        self.rolled_back = True

    def refresh(self, obj) -> None:
        obj.id = 1
        obj.created_at = datetime(2024, 1, 1, tzinfo=timezone.utc)
        self.refreshed_obj = obj


def make_auth_service(
    db=None,
    user_repository=None,
    refresh_token_repository=None,
) -> AuthService:
    service = AuthService(db or FakeDb())
    service.user_repository = user_repository or FakeUserRepository()
    service.refresh_token_repository = (
        refresh_token_repository or FakeRefreshTokenRepository()
    )
    return service


def test_register_rejects_existing_username():
    service = make_auth_service(
        user_repository=FakeUserRepository(username_user=User(id=1))
    )
    body = RegisterRequest(
        username="dima",
        email="dima@example.com",
        password="password",
        birth_date=date(2000, 1, 1),
    )

    with pytest.raises(HTTPException) as error:
        service.register(body)

    assert error.value.status_code == 400
    assert error.value.detail == "Username already exists"


def test_register_rejects_existing_email():
    service = make_auth_service(
        user_repository=FakeUserRepository(email_user=User(id=1))
    )
    body = RegisterRequest(
        username="dima",
        email="dima@example.com",
        password="password",
        birth_date=date(2000, 1, 1),
    )

    with pytest.raises(HTTPException) as error:
        service.register(body)

    assert error.value.status_code == 400
    assert error.value.detail == "Email already exists"


def test_register_creates_user_and_commits():
    db = FakeDb()
    user_repository = FakeUserRepository()
    service = make_auth_service(db=db, user_repository=user_repository)
    body = RegisterRequest(
        username="dima",
        email="dima@example.com",
        password="password",
        birth_date=date(2000, 1, 1),
    )

    result = service.register(body)

    assert result.id == 1
    assert result.username == "dima"
    assert result.email == "dima@example.com"
    assert result.birth_date == date(2000, 1, 1)
    assert user_repository.added_user.username == "dima"
    assert user_repository.added_user.birth_date == date(2000, 1, 1)
    assert user_repository.added_user.password_hash != "password"
    assert db.committed
    assert db.refreshed_obj is user_repository.added_user


def test_login_rejects_missing_user():
    service = make_auth_service(user_repository=FakeUserRepository())

    with pytest.raises(HTTPException) as error:
        service.login("dima", "password")

    assert error.value.status_code == 400
    assert error.value.detail == "Invalid credentials"


def test_login_rejects_wrong_password():
    user = User(id=1, password_hash=get_password_hash("correct-password"))
    service = make_auth_service(
        user_repository=FakeUserRepository(username_or_email_user=user)
    )

    with pytest.raises(HTTPException) as error:
        service.login("dima", "wrong-password")

    assert error.value.status_code == 400
    assert error.value.detail == "Invalid credentials"


def test_login_returns_tokens_and_stores_refresh_token(monkeypatch):
    monkeypatch.setattr(auth_module, "create_refresh_token", lambda: "refresh-token")
    db = FakeDb()
    user = User(id=42, password_hash=get_password_hash("password"))
    refresh_token_repository = FakeRefreshTokenRepository()
    service = make_auth_service(
        db=db,
        user_repository=FakeUserRepository(username_or_email_user=user),
        refresh_token_repository=refresh_token_repository,
    )

    result = service.login("dima", "password")

    assert result.refresh_token == "refresh-token"
    assert result.token_type == "bearer"
    assert decode_access_token(result.access_token) == 42
    assert refresh_token_repository.added_token.user_id == 42
    assert refresh_token_repository.added_token.token_hash == hash_token("refresh-token")
    assert db.committed


def test_logout_rejects_invalid_refresh_token():
    service = make_auth_service(
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=None)
    )

    with pytest.raises(HTTPException) as error:
        service.logout("refresh-token")

    assert error.value.status_code == 401
    assert error.value.detail == "Invalid refresh token"


def test_logout_rejects_revoked_refresh_token():
    token_entry = SimpleNamespace(revoked_at=datetime.now(timezone.utc))
    service = make_auth_service(
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=token_entry)
    )

    with pytest.raises(HTTPException) as error:
        service.logout("refresh-token")

    assert error.value.status_code == 401
    assert error.value.detail == "Token already revoked"


def test_logout_revokes_refresh_token():
    db = FakeDb()
    token_entry = SimpleNamespace(revoked_at=None)
    service = make_auth_service(
        db=db,
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=token_entry),
    )

    result = service.logout("refresh-token")

    assert result == {"message": "Logged out"}
    assert token_entry.revoked_at is not None
    assert db.committed


def test_refresh_rejects_invalid_refresh_token():
    service = make_auth_service(
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=None)
    )

    with pytest.raises(HTTPException) as error:
        service.refresh("refresh-token")

    assert error.value.status_code == 401
    assert error.value.detail == "Invalid refresh token"


def test_refresh_rejects_revoked_refresh_token():
    token_entry = SimpleNamespace(
        revoked_at=datetime.now(timezone.utc),
        expires_at=datetime.now(timezone.utc) + timedelta(days=1),
    )
    service = make_auth_service(
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=token_entry)
    )

    with pytest.raises(HTTPException) as error:
        service.refresh("refresh-token")

    assert error.value.status_code == 401
    assert error.value.detail == "Refresh token revoked"


def test_refresh_rejects_expired_refresh_token():
    token_entry = SimpleNamespace(
        revoked_at=None,
        expires_at=datetime.now(timezone.utc) - timedelta(seconds=1),
    )
    service = make_auth_service(
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=token_entry)
    )

    with pytest.raises(HTTPException) as error:
        service.refresh("refresh-token")

    assert error.value.status_code == 401
    assert error.value.detail == "Refresh token expired"


def test_refresh_returns_new_access_token():
    token_entry = SimpleNamespace(
        user_id=42,
        revoked_at=None,
        expires_at=datetime.now(timezone.utc) + timedelta(days=1),
    )
    service = make_auth_service(
        refresh_token_repository=FakeRefreshTokenRepository(token_entry=token_entry)
    )

    result = service.refresh("refresh-token")

    assert result["token_type"] == "bearer"
    assert decode_access_token(result["access_token"]) == 42
