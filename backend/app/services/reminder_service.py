import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.movie_reminder import MovieReminder
from app.models.user import User
from app.repositories.reminder_repository import ReminderRepository
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient


class ReminderService:
    def __init__(self, db: Session):
        self.db = db
        self.reminder_repository = ReminderRepository(db)
        self.movie_service = MovieService(db)

    def create(
        self,
        user: User,
        tmdb_id: int,
        remind_at: datetime.datetime,
        note: str | None,
        client: MoviesAPIClient,
    ) -> MovieReminder:
        movie = self.movie_service.get_or_create_movie(client, tmdb_id)

        reminder = MovieReminder(
            user_id=user.id,
            movie_id=movie.id,
            remind_at=remind_at,
            note=note,
        )

        self.reminder_repository.add(reminder)
        self.db.commit()
        self.db.refresh(reminder)
        return reminder

    def get_all(self, user: User) -> list[MovieReminder]:
        return self.reminder_repository.get_all_by_user_id(user.id)

    def get_upcoming(self, user: User) -> list[MovieReminder]:
        now = datetime.datetime.now(datetime.UTC).replace(tzinfo=None)
        return self.reminder_repository.get_upcoming_by_user_id(user.id, now)

    def update(
        self,
        user: User,
        reminder_id: int,
        remind_at: datetime.datetime | None,
        note: str | None,
    ) -> MovieReminder | None:
        reminder = self.reminder_repository.get_by_id(reminder_id)
        if reminder is None:
            return None

        self._ensure_owner(reminder, user)

        if remind_at is not None:
            reminder.remind_at = remind_at

        reminder.note = note
        reminder.updated_at = datetime.datetime.now(datetime.UTC).replace(tzinfo=None)

        self.db.commit()
        self.db.refresh(reminder)
        return reminder

    def remove(self, user: User, reminder_id: int) -> bool:
        reminder = self.reminder_repository.get_by_id(reminder_id)
        if reminder is None:
            return False

        self._ensure_owner(reminder, user)

        self.reminder_repository.delete(reminder)
        self.db.commit()
        return True

    def _ensure_owner(self, reminder: MovieReminder, user: User) -> None:
        if reminder.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not allowed")