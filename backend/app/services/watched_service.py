from sqlalchemy.orm import Session

from app.models.user import User
from app.models.watched import Watched
from app.services.collection_service import MovieCollectionService
from app.services.movies_api import MoviesAPIClient


class WatchedService:
    def __init__(self, db: Session):
        self.db = db
        self.collection_service = MovieCollectionService(db)

    def add(self, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watched:
        return self.collection_service.add(Watched, user, tmdb_id, client)

    def get_all(self, user: User) -> list[Watched]:
        return self.collection_service.get_all(Watched, user)

    def remove(self, user: User, tmdb_id: int) -> Watched | None:
        return self.collection_service.remove(Watched, user, tmdb_id)

    def set_rating(self, user: User, tmdb_id: int, rating: int) -> Watched | None:
        watched = self.collection_service.get_one(Watched, user, tmdb_id)
        if watched is None:
            return None

        watched.rating = rating
        self.db.commit()
        self.db.refresh(watched)
        return watched


def add_to_watched(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Watched:
    service = WatchedService(db)
    return service.add(user, tmdb_id, client)


def get_user_watched(db: Session, user: User) -> list[Watched]:
    service = WatchedService(db)
    return service.get_all(user)


def remove_from_watched(db: Session, user: User, tmdb_id: int) -> Watched | None:
    service = WatchedService(db)
    return service.remove(user, tmdb_id)


def set_watched_rating(db: Session, user: User, tmdb_id: int, rating: int) -> Watched | None:
    service = WatchedService(db)
    return service.set_rating(user, tmdb_id, rating)
