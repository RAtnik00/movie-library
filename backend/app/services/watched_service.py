from app.models.watched import Watched
from app.models.user import User

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.services.favorite_service import get_or_create_movie, get_movie_by_tmdb_id
from app.services.movies_api import MoviesAPIClient


def add_to_watched(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watched:
    movie = get_or_create_movie(db, client, tmdb_id)

    stmt = select(Watched).where(
        Watched.user_id == user.id,
        Watched.movie_id == movie.id,
    )
    result = db.execute(stmt)
    watched = result.scalar_one_or_none()

    if watched:
        return watched

    watched = Watched(
        user_id=user.id,
        movie_id=movie.id,
    )

    db.add(watched)
    db.commit()
    db.refresh(watched)
    return watched

def get_user_watched(db: Session, user: User) -> list[Watched]:
    stmt = select(Watched).where(Watched.user_id == user.id)
    result = db.execute(stmt)
    return result.scalars().all()

def remove_from_watched(db: Session, user: User, tmdb_id: int) -> Watched | None:
    movie = get_movie_by_tmdb_id(db, tmdb_id)
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

    db.delete(watched)
    db.commit()
    return watched