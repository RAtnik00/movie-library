from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.user import User
from app.services.collection_service import MovieCollectionService
from app.services.movies_api import MoviesAPIClient


def add_to_favorites(db: Session, user: User, tmdb_id: int, client: MoviesAPIClient):
    service = MovieCollectionService(db)
    return service.add(Favorite, user, tmdb_id, client)


def get_user_favorites(db: Session, user: User) -> list[Favorite]:
    service = MovieCollectionService(db)
    return service.get_all(Favorite, user)


def remove_from_favorites(db: Session, user: User, tmdb_id: int) -> Favorite | None:
    service = MovieCollectionService(db)
    return service.remove(Favorite, user, tmdb_id)