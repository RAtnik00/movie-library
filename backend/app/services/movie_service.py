from datetime import date

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

    def get_popular_movies(self, client: MoviesAPIClient):
        return client.get_popular()

    def search_movies(self, client: MoviesAPIClient, query: str):
        return client.get_search(query)

    def get_movie_details(self, client: MoviesAPIClient, movie_id: int):
        return client.get_movie(movie_id)

    def get_or_create_movie(
        self,
        client: MoviesAPIClient,
        tmdb_id: int,
    ) -> Movie:
        movie = self.movie_repository.get_by_tmdb_id(tmdb_id)
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

        self.movie_repository.add(movie)
        self.db.commit()
        self.db.refresh(movie)
        return movie
