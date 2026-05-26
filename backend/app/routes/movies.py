from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.movies import get_movies_api_client
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient

router = APIRouter()


@router.get("/movies")
def get_movies(
<<<<<<< HEAD
    page: int = 1,
=======
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
):
    service = MovieService(db)
<<<<<<< HEAD
    return service.get_popular_movies(client, page)
=======
    return service.get_popular_movies(client)
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7


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
