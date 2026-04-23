from sqlalchemy import select, or_
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_username(self, username: str) -> User | None:
        stmt = select(User).where(User.username == username)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_by_username_or_email(self, username_or_email: str) -> User | None:
        stmt = select(User).where(
            or_(User.username == username_or_email, User.email == username_or_email)
        )
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def add(self, user: User) -> None:
        self.db.add(user)