from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.user import User
from app.services.collection_service import MovieCollectionService
from app.services.movies_api import MoviesAPIClient


class FavoriteService:
    def __init__(self, db: Session):
        self.collection_service = MovieCollectionService(db)

    def add(self, user: User, tmdb_id: int, client: MoviesAPIClient) -> Favorite:
        return self.collection_service.add(Favorite, user, tmdb_id, client)

    def get_all(self, user: User) -> list[Favorite]:
        return self.collection_service.get_all(Favorite, user)

    def remove(self, user: User, tmdb_id: int) -> Favorite | None:
        return self.collection_service.remove(Favorite, user, tmdb_id)


def add_to_favorites(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient) -> Favorite:
    service = FavoriteService(db)
    return service.add(user, tmdb_id, client)


def get_user_favorites(db: Session, user: User) -> list[Favorite]:
    service = FavoriteService(db)
    return service.get_all(user)


def remove_from_favorites(db: Session, user: User, tmdb_id: int) -> Favorite | None:
    service = FavoriteService(db)
    return service.remove(user, tmdb_id)
