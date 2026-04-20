from app.models.watchlist import Watchlist
from app.models.user import User

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.services.favorite_service import get_or_create_movie, get_movie_by_tmdb_id
from app.services.movies_api import MoviesAPIClient


def add_to_watchlist(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watchlist:
    movie = get_or_create_movie(db, client, tmdb_id)

    stmt = select(Watchlist).where(
        Watchlist.user_id == user.id,
        Watchlist.movie_id == movie.id,
    )
    result = db.execute(stmt)
    watchlist = result.scalar_one_or_none()

    if watchlist:
        return watchlist

    watchlist = Watchlist(
        user_id=user.id,
        movie_id=movie.id,
    )

    db.add(watchlist)
    db.commit()
    db.refresh(watchlist)
    return watchlist

def get_user_watchlist(db: Session, user: User) -> list[Watchlist]:
    stmt = select(Watchlist).where(Watchlist.user_id == user.id)
    result = db.execute(stmt)
    return result.scalars().all()

def remove_from_watchlist(db: Session, user: User, tmdb_id: int) -> Watchlist | None:
    movie = get_movie_by_tmdb_id(db, tmdb_id)
    if movie is None:
        return None

    stmt = select(Watchlist).where(
        Watchlist.user_id == user.id,
        Watchlist.movie_id == movie.id,
    )
    result = db.execute(stmt)
    watchlist = result.scalar_one_or_none()

    if watchlist is None:
        return None

    db.delete(watchlist)
    db.commit()
    return watchlist