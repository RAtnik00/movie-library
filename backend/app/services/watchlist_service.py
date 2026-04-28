from sqlalchemy.orm import Session

from app.models.user import User
from app.models.watchlist import Watchlist
from app.services.collection_service import MovieCollectionService
from app.services.movies_api import MoviesAPIClient


class WatchlistService:
    def __init__(self, db: Session):
        self.collection_service = MovieCollectionService(db)

    def add(self, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watchlist:
        return self.collection_service.add(Watchlist, user, tmdb_id, client)

    def get_all(self, user: User) -> list[Watchlist]:
        return self.collection_service.get_all(Watchlist, user)

    def remove(self, user: User, tmdb_id: int) -> Watchlist | None:
        return self.collection_service.remove(Watchlist, user, tmdb_id)


def add_to_watchlist(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watchlist:
    service = WatchlistService(db)
    return service.add(user, tmdb_id, client)


def get_user_watchlist(db: Session, user: User) -> list[Watchlist]:
    service = WatchlistService(db)
    return service.get_all(user)


def remove_from_watchlist(db: Session, user: User, tmdb_id: int) -> Watchlist | None:
    service = WatchlistService(db)
    return service.remove(user, tmdb_id)