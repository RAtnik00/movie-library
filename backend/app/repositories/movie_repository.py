from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.movie import Movie

class MovieRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_tmdb_id(self, tmdb_id: int) -> Movie | None:
        stmt = select(Movie).where(Movie.tmdb_id == tmdb_id)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def add(self, movie: Movie) -> None:
        self.db.add(movie)