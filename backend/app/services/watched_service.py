from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.watched import Watched
from app.services.collection_service import MovieCollectionService
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient


def add_to_watched(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watched:
    service = MovieCollectionService(db)
    return service.add(Watched, user, tmdb_id, client)


def get_user_watched(db: Session, user: User) -> list[Watched]:
    service = MovieCollectionService(db)
    return service.get_all(Watched, user)


def remove_from_watched(db: Session, user: User, tmdb_id: int) -> Watched | None:
    service = MovieCollectionService(db)
    return service.remove(Watched, user, tmdb_id)


def set_watched_rating(db: Session, user: User, tmdb_id: int, rating: int) -> Watched | None:
    movie_service = MovieService(db)
    movie = movie_service.get_movie_by_tmdb_id(tmdb_id)
    if movie is None:
        return None

    stmt = select(Watched).where(
        Watched.user_id == user.id,
        Watched.movie_id == movie.id,
    )
    result = db.execute(stmt)
    watched = result.scalar_one_or_none()

    if watched is None:
        return None

    watched.rating = rating
    db.commit()
    db.refresh(watched)
    return watched