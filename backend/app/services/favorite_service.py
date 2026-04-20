from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.models.favorite import Favorite
from app.models.user import User
from app.services.movies_api import MoviesAPIClient

def get_movie_by_tmdb_id(db: Session, tmdb_id: int) -> Movie | None:
    stmt = select(Movie).where(Movie.tmdb_id == tmdb_id)
    result = db.execute(stmt)
    movie = result.scalar_one_or_none()
    return movie

def get_or_create_movie(
        db: Session,
        client: MoviesAPIClient,
        tmdb_id: int
) -> Movie | None:
    movie = get_movie_by_tmdb_id(db, tmdb_id)

    if movie:
        return movie

    movie_data = client.get_movie(tmdb_id)

    release_date = None
    if movie_data.get("release_date"):
        release_date = date.fromisoformat(movie_data["release_date"])

    movie = Movie(
        tmdb_id=movie_data["id"],
        title=movie_data["title"],
        overview=movie_data.get("overview"),
        poster_path=movie_data.get("poster_path"),
        release_date=release_date,
    )

    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie

def add_to_favorites(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient):
    movie = get_or_create_movie(db, client, tmdb_id)

    stmt = select(Favorite).where(
        Favorite.user_id == user.id,
        Favorite.movie_id == movie.id,
    )
    result = db.execute(stmt)
    favorite = result.scalar_one_or_none()

    if favorite:
        return favorite

    favorite = Favorite(
        user_id=user.id,
        movie_id=movie.id,
    )

    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

def get_user_favorites(db: Session, user: User) -> list[Favorite]:
    stmt = select(Favorite).where(Favorite.user_id == user.id)
    result = db.execute(stmt)
    return result.scalars().all()

def remove_from_favorites(db: Session, user: User, tmdb_id: int) -> Favorite | None:
    movie = get_movie_by_tmdb_id(db, tmdb_id)
    if movie is None:
        return None

    stmt = select(Favorite).where(
        Favorite.user_id == user.id,
        Favorite.movie_id == movie.id,
    )
    result = db.execute(stmt)
    favorite = result.scalar_one_or_none()

    if favorite is None:
        return None

    db.delete(favorite)
    db.commit()
    return favorite
