from types import SimpleNamespace

from app.models.favorite import Favorite
from app.models.user import User
from app.services.collection_service import MovieCollectionService


class FakeMovieService:
    def __init__(self, movie):
        self.movie = movie

    def get_or_create_movie(self, client, tmdb_id: int):
        return self.movie

    def get_movie_by_tmdb_id(self, tmdb_id: int):
        return self.movie


class FakeCollectionRepository:
    def __init__(self, obj=None, items=None):
        self.obj = obj
        self.items = items or []
        self.added_obj = None
        self.deleted_obj = None

    def get(self, model, user_id: int, movie_id: int):
        return self.obj

    def get_all(self, model, user_id: int):
        return self.items

    def add(self, obj) -> None:
        self.added_obj = obj

    def delete(self, obj) -> None:
        self.deleted_obj = obj


class FakeDb:
    def __init__(self):
        self.committed = False
        self.refreshed_obj = None

    def commit(self) -> None:
        self.committed = True

    def refresh(self, obj) -> None:
        self.refreshed_obj = obj


def test_add_returns_existing_collection_object():
    user = User(id=1)
    movie = SimpleNamespace(id=10)
    existing_favorite = Favorite(user_id=1, movie_id=10)
    db = FakeDb()
    service = MovieCollectionService(db=db)
    service.movie_service = FakeMovieService(movie)
    service.collection_repository = FakeCollectionRepository(obj=existing_favorite)

    result = service.add(Favorite, user, tmdb_id=123, client=object())

    assert result is existing_favorite
    assert service.collection_repository.added_obj is None
    assert not db.committed
    assert db.refreshed_obj is None


def test_add_creates_collection_object():
    user = User(id=1)
    movie = SimpleNamespace(id=10)
    db = FakeDb()
    service = MovieCollectionService(db=db)
    service.movie_service = FakeMovieService(movie)
    service.collection_repository = FakeCollectionRepository(obj=None)

    result = service.add(Favorite, user, tmdb_id=123, client=object())

    assert result.user_id == 1
    assert result.movie_id == 10
    assert service.collection_repository.added_obj is result
    assert db.committed
    assert db.refreshed_obj is result


def test_get_all_returns_repository_items():
    user = User(id=1)
    favorite = Favorite(user_id=1, movie_id=10)
    service = MovieCollectionService(db=object())
    service.collection_repository = FakeCollectionRepository(items=[favorite])

    result = service.get_all(Favorite, user)

    assert result == [favorite]


def test_get_one_returns_none_when_movie_does_not_exist():
    user = User(id=1)
    service = MovieCollectionService(db=object())
    service.movie_service = FakeMovieService(movie=None)

    result = service.get_one(Favorite, user, tmdb_id=123)

    assert result is None


def test_remove_returns_none_when_collection_object_does_not_exist():
    user = User(id=1)
    movie = SimpleNamespace(id=10)
    db = FakeDb()
    service = MovieCollectionService(db=db)
    service.movie_service = FakeMovieService(movie)
    service.collection_repository = FakeCollectionRepository(obj=None)

    result = service.remove(Favorite, user, tmdb_id=123)

    assert result is None
    assert not db.committed


def test_remove_deletes_collection_object_and_commits():
    user = User(id=1)
    movie = SimpleNamespace(id=10)
    favorite = Favorite(user_id=1, movie_id=10)
    db = FakeDb()
    service = MovieCollectionService(db=db)
    service.movie_service = FakeMovieService(movie)
    service.collection_repository = FakeCollectionRepository(obj=favorite)

    result = service.remove(Favorite, user, tmdb_id=123)

    assert result is favorite
    assert service.collection_repository.deleted_obj is favorite
    assert db.committed
