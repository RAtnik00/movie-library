from datetime import date

import httpx
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.movie import Movie
from app.repositories.movie_repository import MovieRepository
from app.services.movies_api import MoviesAPIClient


class MovieService:
    def __init__(self, db: Session):
        self.db = db
        self.movie_repository = MovieRepository(db)

    def get_movie_by_tmdb_id(self, tmdb_id: int) -> Movie | None:
        return self.movie_repository.get_by_tmdb_id(tmdb_id)

    def get_popular_movies(self, client: MoviesAPIClient, page: int = 1):
        try:
            return client.get_popular(page)
        except httpx.HTTPStatusError as error:
            self._handle_movies_api_error(error)

    def search_movies(self, client: MoviesAPIClient, query: str):
        try:
            return client.get_search(query)
        except httpx.HTTPStatusError as error:
            self._handle_movies_api_error(error)

    def get_movie_details(self, client: MoviesAPIClient, movie_id: int):
        try:
            movie_data = client.get_movie_with_credits(movie_id)
        except httpx.HTTPStatusError as error:
            self._handle_movies_api_error(error)

        movie_data["director"] = self._extract_director(movie_data)
        return movie_data

    def get_or_create_movie(
        self,
        client: MoviesAPIClient,
        tmdb_id: int,
    ) -> Movie:
        movie = self.movie_repository.get_by_tmdb_id(tmdb_id)
        if movie:
            return movie

        try:
            movie_data = client.get_movie(tmdb_id)
        except httpx.HTTPStatusError as error:
            self._handle_movies_api_error(error)

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

        self.movie_repository.add(movie)
        self.db.commit()
        self.db.refresh(movie)
        return movie

    def _extract_director(self, movie_data: dict) -> str | None:
        crew = movie_data.get("credits", {}).get("crew", [])

        for person in crew:
            if person.get("job") == "Director":
                return person.get("name")

        return None

    def _handle_movies_api_error(self, error: httpx.HTTPStatusError):
        status_code = error.response.status_code

        if status_code == 404:
            raise HTTPException(status_code=404, detail="Movie not found")

        raise HTTPException(
            status_code=502,
            detail="Movie provider unavailable",
        )
