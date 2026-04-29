import pytest
from fastapi import HTTPException

from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    hash_token,
    verify_password,
)


def test_password_hash_round_trip():
    password = "strong-password"

    hashed_password = get_password_hash(password)

    assert hashed_password != password
    assert verify_password(password, hashed_password)
    assert not verify_password("wrong-password", hashed_password)


def test_hash_token_is_deterministic():
    token = "refresh-token"

    first_hash = hash_token(token)
    second_hash = hash_token(token)

    assert first_hash == second_hash
    assert first_hash != token


def test_access_token_round_trip():
    token = create_access_token(data={"sub": "123"})

    user_id = decode_access_token(token)

    assert user_id == 123


def test_decode_access_token_rejects_invalid_token():
    with pytest.raises(HTTPException) as error:
        decode_access_token("invalid-token")

    assert error.value.status_code == 401
