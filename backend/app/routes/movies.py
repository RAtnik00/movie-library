from fastapi import APIRouter
from fastapi import Depends

from app.dependencies.movies import get_movies_api_client
from app.services.movies_api import MoviesAPIClient

router = APIRouter()

@router.get("/movies")
def get_movies(client: MoviesAPIClient = Depends(get_movies_api_client)):
    return client.get_popular()

@router.get("/movies/search")
def get_search(query: str, client: MoviesAPIClient = Depends(get_movies_api_client)):
    return client.get_search(query)
