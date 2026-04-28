from typing import TypeVar

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.watched import Watched
from app.models.watchlist import Watchlist


CollectionModel = TypeVar("CollectionModel", Favorite, Watchlist, Watched)


class CollectionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(
        self,
        model: type[CollectionModel],
        user_id: int,
        movie_id: int,
    ) -> CollectionModel | None:
        stmt = select(model).where(
            model.user_id == user_id,
            model.movie_id == movie_id,
        )
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_all(
        self,
        model: type[CollectionModel],
        user_id: int,
    ) -> list[CollectionModel]:
        stmt = select(model).where(model.user_id == user_id)
        result = self.db.execute(stmt)
        return result.scalars().all()

    def add(self, obj: CollectionModel) -> None:
        self.db.add(obj)

    def delete(self, obj: CollectionModel) -> None:
        self.db.delete(obj)
