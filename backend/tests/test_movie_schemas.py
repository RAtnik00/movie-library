import pytest
from pydantic import ValidationError

from app.schemas.movie import MovieCommentCreateRequest, SetWatchedRatingRequest


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


def test_movie_comment_accepts_valid_text():
    body = MovieCommentCreateRequest(tmdb_id=550, text="Great movie")

    assert body.tmdb_id == 550
    assert body.text == "Great movie"


def test_movie_comment_rejects_empty_text():
    with pytest.raises(ValidationError):
        MovieCommentCreateRequest(tmdb_id=550, text="")


def test_movie_comment_rejects_too_long_text():
    with pytest.raises(ValidationError):
        MovieCommentCreateRequest(tmdb_id=550, text="x" * 1001)
