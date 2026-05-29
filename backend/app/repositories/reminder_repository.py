from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.movie_reminder import MovieReminder


class ReminderRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, reminder_id: int) -> MovieReminder | None:
        stmt = select(MovieReminder).where(MovieReminder.id == reminder_id)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_all_by_user_id(self, user_id: int) -> list[MovieReminder]:
        stmt = (
            select(MovieReminder)
            .where(MovieReminder.user_id == user_id)
            .order_by(MovieReminder.remind_at.asc())
        )
        result = self.db.execute(stmt)
        return result.scalars().all()

    def get_upcoming_by_user_id(self, user_id: int, now) -> list[MovieReminder]:
        stmt = (
            select(MovieReminder)
            .where(
                MovieReminder.user_id == user_id,
                MovieReminder.remind_at >= now,
            )
            .order_by(MovieReminder.remind_at.asc())
        )
        result = self.db.execute(stmt)
        return result.scalars().all()

    def add(self, reminder: MovieReminder) -> None:
        self.db.add(reminder)

    def delete(self, reminder: MovieReminder) -> None:
        self.db.delete(reminder)
