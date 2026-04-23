from sqlalchemy.orm import Session

from app.models.user import User
from app.models.watchlist import Watchlist
from app.services.collection_service import MovieCollectionService
from app.services.movies_api import MoviesAPIClient


def add_to_watchlist(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watchlist:
    service = MovieCollectionService(db)
    return service.add(Watchlist, user, tmdb_id, client)


def get_user_watchlist(db: Session, user: User) -> list[Watchlist]:
    service = MovieCollectionService(db)
    return service.get_all(Watchlist, user)


def remove_from_watchlist(db: Session, user: User, tmdb_id: int) -> Watchlist | None:
    service = MovieCollectionService(db)
    return service.remove(Watchlist, user, tmdb_id)