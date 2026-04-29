import pytest
from pydantic import ValidationError

from app.schemas.movie import SetWatchedRatingRequest


def test_watched_rating_accepts_min_value():
    body = SetWatchedRatingRequest(rating=1)

    assert body.rating == 1


def test_watched_rating_accepts_max_value():
    body = SetWatchedRatingRequest(rating=10)

    assert body.rating == 10


def test_watched_rating_rejects_value_below_min():
    with pytest.raises(ValidationError):
        SetWatchedRatingRequest(rating=0)


def test_watched_rating_rejects_value_above_max():
    with pytest.raises(ValidationError):
        SetWatchedRatingRequest(rating=11)
