from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.models.movie_comment import MovieComment
from app.models.user import User
from app.services.comment_service import CommentService


class FakeMovieService:
    def __init__(self, movie):
        self.movie = movie

    def get_or_create_movie(self, client, tmdb_id: int):
        return self.movie

    def get_movie_by_tmdb_id(self, tmdb_id: int):
        return self.movie


class FakeCommentRepository:
    def __init__(self, comment=None, comments=None):
        self.comment = comment
        self.comments = comments or []
        self.added_comment = None
        self.deleted_comment = None

    def get_by_id(self, comment_id: int):
        return self.comment

    def get_by_movie_id(self, movie_id: int):
        return self.comments

    def add(self, comment: MovieComment) -> None:
        self.added_comment = comment

    def delete(self, comment: MovieComment) -> None:
        self.deleted_comment = comment


class FakeDb:
    def __init__(self):
        self.committed = False
        self.refreshed_obj = None

    def commit(self) -> None:
        self.committed = True

    def refresh(self, obj) -> None:
        self.refreshed_obj = obj


def make_comment_service(
    db=None,
    movie=None,
    comment_repository=None,
) -> CommentService:
    service = CommentService(db or FakeDb())
    service.movie_service = FakeMovieService(movie)
    service.comment_repository = comment_repository or FakeCommentRepository()
    return service


def test_create_comment_creates_comment_and_commits():
    db = FakeDb()
    user = User(id=1)
    movie = SimpleNamespace(id=10)
    repository = FakeCommentRepository()
    service = make_comment_service(db=db, movie=movie, comment_repository=repository)

    result = service.create(user, tmdb_id=123, text="Great movie", client=object())

    assert result.user_id == 1
    assert result.movie_id == 10
    assert result.text == "Great movie"
    assert repository.added_comment is result
    assert db.committed
    assert db.refreshed_obj is result


def test_get_for_movie_returns_empty_list_when_movie_is_missing():
    service = make_comment_service(movie=None)

    result = service.get_for_movie(tmdb_id=123)

    assert result == []


def test_get_for_movie_returns_repository_comments():
    comment = MovieComment(user_id=1, movie_id=10, text="Nice")
    movie = SimpleNamespace(id=10)
    repository = FakeCommentRepository(comments=[comment])
    service = make_comment_service(movie=movie, comment_repository=repository)

    result = service.get_for_movie(tmdb_id=123)

    assert result == [comment]


def test_update_returns_none_when_comment_is_missing():
    db = FakeDb()
    service = make_comment_service(
        db=db,
        comment_repository=FakeCommentRepository(comment=None),
    )

    result = service.update(User(id=1), comment_id=99, text="Updated")

    assert result is None
    assert not db.committed


def test_update_rejects_non_owner():
    comment = MovieComment(user_id=2, movie_id=10, text="Old")
    service = make_comment_service(
        comment_repository=FakeCommentRepository(comment=comment),
    )

    with pytest.raises(HTTPException) as error:
        service.update(User(id=1), comment_id=99, text="Updated")

    assert error.value.status_code == 403
    assert error.value.detail == "Not allowed"


def test_update_changes_comment_and_commits():
    db = FakeDb()
    comment = MovieComment(user_id=1, movie_id=10, text="Old")
    service = make_comment_service(
        db=db,
        comment_repository=FakeCommentRepository(comment=comment),
    )

    result = service.update(User(id=1), comment_id=99, text="Updated")

    assert result is comment
    assert comment.text == "Updated"
    assert comment.updated_at is not None
    assert db.committed
    assert db.refreshed_obj is comment


def test_remove_deletes_comment_and_commits():
    db = FakeDb()
    comment = MovieComment(user_id=1, movie_id=10, text="Old")
    repository = FakeCommentRepository(comment=comment)
    service = make_comment_service(db=db, comment_repository=repository)

    result = service.remove(User(id=1), comment_id=99)

    assert result is comment
    assert repository.deleted_comment is comment
    assert db.committed
