from typing import TypeVar

from sqlalchemy.orm import Session

from app.models.favorite import Favorite
from app.models.user import User
from app.models.watched import Watched
from app.models.watchlist import Watchlist
from app.repositories.collection_repository import CollectionRepository
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient


CollectionModel = TypeVar("CollectionModel", Favorite, Watchlist, Watched)


class MovieCollectionService:
    def __init__(self, db: Session):
        self.db = db
        self.movie_service = MovieService(db)
        self.collection_repository = CollectionRepository(db)

    def add(
        self,
        model: type[CollectionModel],
        user: User,
        tmdb_id: int,
        client: MoviesAPIClient,
    ) -> CollectionModel:
        movie = self.movie_service.get_or_create_movie(client, tmdb_id)

        obj = self.collection_repository.get(model, user.id, movie.id)
        if obj:
            return obj

        obj = model(
            user_id=user.id,
            movie_id=movie.id,
        )

        self.collection_repository.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_all(
        self,
        model: type[CollectionModel],
        user: User,
    ) -> list[CollectionModel]:
        return self.collection_repository.get_all(model, user.id)

    def get_one(
        self,
        model: type[CollectionModel],
        user: User,
        tmdb_id: int,
    ) -> CollectionModel | None:
        movie = self.movie_service.get_movie_by_tmdb_id(tmdb_id)
        if movie is None:
            return None

        return self.collection_repository.get(model, user.id, movie.id)

    def remove(
        self,
        model: type[CollectionModel],
        user: User,
        tmdb_id: int,
    ) -> CollectionModel | None:
        obj = self.get_one(model, user, tmdb_id)
        if obj is None:
            return None

        self.collection_repository.delete(obj)
        self.db.commit()
        return obj
