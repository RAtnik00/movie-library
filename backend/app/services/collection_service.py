from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient


class MovieCollectionService:
    def __init__(self, db: Session):
        self.db = db
        self.movie_service = MovieService(db)

    def add(self, model, user: User, tmdb_id: int, client: MoviesAPIClient):
        movie = self.movie_service.get_or_create_movie(client, tmdb_id)

        stmt = select(model).where(
            model.user_id == user.id,
            model.movie_id == movie.id,
        )
        result = self.db.execute(stmt)
        obj = result.scalar_one_or_none()

        if obj:
            return obj

        obj = model(
            user_id=user.id,
            movie_id=movie.id,
        )

        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_all(self, model, user: User):
        stmt = select(model).where(model.user_id == user.id)
        result = self.db.execute(stmt)
        return result.scalars().all()

    def remove(self, model, user: User, tmdb_id: int):
        movie = self.movie_service.get_movie_by_tmdb_id(tmdb_id)
        if movie is None:
            return None

        stmt = select(model).where(
            model.user_id == user.id,
            model.movie_id == movie.id,
        )
        result = self.db.execute(stmt)
        obj = result.scalar_one_or_none()

        if obj is None:
            return None

        self.db.delete(obj)
        self.db.commit()
        return obj