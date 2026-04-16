from fastapi import APIRouter
from fastapi import Depends

from app.dependencies.movies import get_movies_api_client
from app.services.movies_api import MoviesAPIClient
from app.database import get_db
from app.core.security import get_current_user
from app.schemas.user import AddFavoriteRequest
from app.services.favorite_service import add_to_favorites
from app.models.user import User

from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/movies")
def get_movies(client: MoviesAPIClient = Depends(get_movies_api_client)):
    return client.get_popular()

@router.get("/movies/search")
def get_search(query: str, client: MoviesAPIClient = Depends(get_movies_api_client)):
    return client.get_search(query)

@router.get("/movies/{movie_id}")
def get_movie(movie_id: int, client: MoviesAPIClient = Depends(get_movies_api_client)):
    return client.get_movie(movie_id)

@router.post("/favorites")
def add_favorites(
        body: AddFavoriteRequest,
        db: Session = Depends(get_db),
        client: MoviesAPIClient = Depends(get_movies_api_client),
        current_user: User = Depends(get_current_user)
):
    return add_to_favorites(db, current_user, body.tmdb_id, client)
