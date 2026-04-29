from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.movies import get_movies_api_client
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient

router = APIRouter()


@router.get("/movies")
def get_movies(
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
):
    service = MovieService(db)
    return service.get_popular_movies(client)


@router.get("/movies/search")
def get_search(
    query: str,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
):
    service = MovieService(db)
    return service.search_movies(client, query)


@router.get("/movies/{movie_id}")
def get_movie(
    movie_id: int,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
):
    service = MovieService(db)
    return service.get_movie_details(client, movie_id)
