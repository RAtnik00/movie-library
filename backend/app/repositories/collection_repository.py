from sqlalchemy import select
from sqlalchemy.orm import Session


class CollectionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, model, user_id: int, movie_id: int):
        stmt = select(model).where(
            model.user_id == user_id,
            model.movie_id == movie_id,
        )
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_all(self, model, user_id: int):
        stmt = select(model).where(model.user_id == user_id)
        result = self.db.execute(stmt)
        return result.scalars().all()

    def add(self, obj) -> None:
        self.db.add(obj)

    def delete(self, obj) -> None:
        self.db.delete(obj)