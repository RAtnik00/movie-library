from datetime import date

import httpx
import pytest
from fastapi import HTTPException

from app.models.movie import Movie
from app.services.movie_service import MovieService


def make_http_status_error(status_code: int) -> httpx.HTTPStatusError:
    request = httpx.Request("GET", "https://tmdb.test/movie/123")
    response = httpx.Response(status_code=status_code, request=request)
    return httpx.HTTPStatusError(
        "Movie provider error",
        request=request,
        response=response,
    )


class FakeMoviesClientWithNotFound:
    def get_movie(self, movie_id: int):
        raise make_http_status_error(404)


class FakeMoviesClientWithServerError:
    def get_movie(self, movie_id: int):
        raise make_http_status_error(500)


class FakeMoviesClient:
    def __init__(self):
        self.called = False
        self.page = None

    def get_popular(self, page: int):
        self.called = True
        self.page = page
        return [{"id": 1, "title": "Inception"}]


class FakeSearchMoviesClient:
    def __init__(self):
        self.query = None

    def get_search(self, query: str):
        self.query = query
        return [{"id": 2, "title": "Interstellar"}]


class FakeMovieDetailsClient:
    def __init__(self, movie_data: dict):
        self.movie_data = movie_data
        self.called_with = None

    def get_movie(self, movie_id: int):
        self.called_with = movie_id
        return self.movie_data


class FakeMovieRepository:
    def __init__(self, movie: Movie | None = None):
        self.movie = movie
        self.added_movie = None

    def get_by_tmdb_id(self, tmdb_id: int) -> Movie | None:
        return self.movie

    def add(self, movie: Movie) -> None:
        self.added_movie = movie


class FakeDb:
    def __init__(self):
        self.committed = False
        self.refreshed_obj = None

    def commit(self) -> None:
        self.committed = True

    def refresh(self, obj) -> None:
        self.refreshed_obj = obj


def test_get_popular_movies_returns_client_result():
    service = MovieService(db=object())
    client = FakeMoviesClient()

    result = service.get_popular_movies(client)

    assert result == [{"id": 1, "title": "Inception"}]
    assert client.called
    assert client.page == 1


def test_search_movies_returns_client_result():
    service = MovieService(db=object())
    client = FakeSearchMoviesClient()

    result = service.search_movies(client, query="interstellar")

    assert result == [{"id": 2, "title": "Interstellar"}]
    assert client.query == "interstellar"


def test_get_movie_details_converts_tmdb_404_to_http_exception():
    service = MovieService(db=object())
    client = FakeMoviesClientWithNotFound()

    with pytest.raises(HTTPException) as error:
        service.get_movie_details(client, movie_id=123)

    assert error.value.status_code == 404
    assert error.value.detail == "Movie not found"


def test_get_movie_details_converts_tmdb_500_to_http_exception():
    service = MovieService(db=object())
    client = FakeMoviesClientWithServerError()

    with pytest.raises(HTTPException) as error:
        service.get_movie_details(client, movie_id=123)

    assert error.value.status_code == 502
    assert error.value.detail == "Movie provider unavailable"


def test_get_or_create_movie_returns_existing_movie_without_calling_client():
    existing_movie = Movie(id=1, tmdb_id=123, title="Existing movie")
    db = FakeDb()
    service = MovieService(db=db)
    service.movie_repository = FakeMovieRepository(movie=existing_movie)
    client = FakeMovieDetailsClient(movie_data={})

    result = service.get_or_create_movie(client, tmdb_id=123)

    assert result is existing_movie
    assert client.called_with is None
    assert not db.committed
    assert db.refreshed_obj is None


def test_get_or_create_movie_creates_movie_from_client_data():
    movie_data = {
        "id": 123,
        "title": "Created movie",
        "overview": "Movie overview",
        "poster_path": "/poster.jpg",
        "release_date": "2024-01-15",
    }
    db = FakeDb()
    service = MovieService(db=db)
    service.movie_repository = FakeMovieRepository(movie=None)
    client = FakeMovieDetailsClient(movie_data=movie_data)

    result = service.get_or_create_movie(client, tmdb_id=123)

    assert result.tmdb_id == 123
    assert result.title == "Created movie"
    assert result.overview == "Movie overview"
    assert result.poster_path == "/poster.jpg"
    assert result.release_date == date(2024, 1, 15)
    assert service.movie_repository.added_movie is result
    assert db.committed
    assert db.refreshed_obj is result
