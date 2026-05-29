import datetime
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.models.favorite import Favorite
from app.models.movie import Movie
from app.models.movie_comment import MovieComment
from app.models.movie_reminder import MovieReminder
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.models.watched import Watched
from app.models.watchlist import Watchlist
from app.services.reminder_service import ReminderService


class FakeMovieService:
    def __init__(self, movie):
        self.movie = movie

    def get_or_create_movie(self, client, tmdb_id: int):
        return self.movie


class FakeReminderRepository:
    def __init__(self, reminder=None, reminders=None):
        self.reminder = reminder
        self.reminders = reminders or []
        self.added_reminder = None
        self.deleted_reminder = None

    def get_by_id(self, reminder_id: int):
        return self.reminder

    def get_all_by_user_id(self, user_id: int):
        return self.reminders

    def get_upcoming_by_user_id(self, user_id: int, now):
        return self.reminders

    def add(self, reminder: MovieReminder) -> None:
        self.added_reminder = reminder

    def delete(self, reminder: MovieReminder) -> None:
        self.deleted_reminder = reminder


class FakeDb:
    def __init__(self):
        self.committed = False
        self.refreshed_obj = None

    def commit(self) -> None:
        self.committed = True

    def refresh(self, obj) -> None:
        self.refreshed_obj = obj


def make_reminder_service(
    db=None,
    movie=None,
    reminder_repository=None,
) -> ReminderService:
    service = ReminderService(db or FakeDb())
    service.movie_service = FakeMovieService(movie)
    service.reminder_repository = reminder_repository or FakeReminderRepository()
    return service


def test_create_reminder_creates_reminder_and_commits():
    db = FakeDb()
    user = User(id=1)
    movie = SimpleNamespace(id=10)
    remind_at = datetime.datetime(2026, 6, 1, 20, 0)
    repository = FakeReminderRepository()
    service = make_reminder_service(
        db=db,
        movie=movie,
        reminder_repository=repository,
    )

    result = service.create(
        user,
        tmdb_id=550,
        remind_at=remind_at,
        note="Watch tonight",
        client=object(),
    )

    assert result.user_id == 1
    assert result.movie_id == 10
    assert result.remind_at == remind_at
    assert result.note == "Watch tonight"
    assert repository.added_reminder is result
    assert db.committed
    assert db.refreshed_obj is result


def test_get_all_returns_repository_items():
    reminder = MovieReminder(user_id=1, movie_id=10)
    repository = FakeReminderRepository(reminders=[reminder])
    service = make_reminder_service(reminder_repository=repository)

    result = service.get_all(User(id=1))

    assert result == [reminder]


def test_get_upcoming_returns_repository_items():
    reminder = MovieReminder(user_id=1, movie_id=10)
    repository = FakeReminderRepository(reminders=[reminder])
    service = make_reminder_service(reminder_repository=repository)

    result = service.get_upcoming(User(id=1))

    assert result == [reminder]


def test_update_returns_none_when_reminder_is_missing():
    db = FakeDb()
    service = make_reminder_service(
        db=db,
        reminder_repository=FakeReminderRepository(reminder=None),
    )

    result = service.update(
        User(id=1),
        reminder_id=99,
        remind_at=None,
        note="Updated",
    )

    assert result is None
    assert not db.committed


def test_update_rejects_non_owner():
    reminder = MovieReminder(user_id=2, movie_id=10)
    service = make_reminder_service(
        reminder_repository=FakeReminderRepository(reminder=reminder),
    )

    with pytest.raises(HTTPException) as error:
        service.update(
            User(id=1),
            reminder_id=99,
            remind_at=None,
            note="Updated",
        )

    assert error.value.status_code == 403
    assert error.value.detail == "Not allowed"


def test_update_changes_reminder_and_commits():
    db = FakeDb()
    old_remind_at = datetime.datetime(2026, 6, 1, 20, 0)
    new_remind_at = datetime.datetime(2026, 6, 2, 21, 0)
    reminder = MovieReminder(
        user_id=1,
        movie_id=10,
        remind_at=old_remind_at,
        note="Old",
    )
    service = make_reminder_service(
        db=db,
        reminder_repository=FakeReminderRepository(reminder=reminder),
    )

    result = service.update(
        User(id=1),
        reminder_id=99,
        remind_at=new_remind_at,
        note="Updated",
    )

    assert result is reminder
    assert reminder.remind_at == new_remind_at
    assert reminder.note == "Updated"
    assert reminder.updated_at is not None
    assert db.committed
    assert db.refreshed_obj is reminder


def test_remove_deletes_reminder_and_commits():
    db = FakeDb()
    reminder = MovieReminder(user_id=1, movie_id=10)
    repository = FakeReminderRepository(reminder=reminder)
    service = make_reminder_service(db=db, reminder_repository=repository)

    result = service.remove(User(id=1), reminder_id=99)

    assert result is reminder
    assert repository.deleted_reminder is reminder
    assert db.committed
