from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.dependencies.movies import get_movies_api_client
from app.models.user import User
from app.schemas.movie import MovieActionRequest
from app.services.favorite_service import FavoriteService
from app.services.movies_api import MoviesAPIClient


router = APIRouter(prefix="/favorites", tags=["favorites"])


@router.post("")
def add_favorites(
    body: MovieActionRequest,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
    current_user: User = Depends(get_current_user),
):
    service = FavoriteService(db)
    return service.add(current_user, body.tmdb_id, client)


@router.get("")
def get_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = FavoriteService(db)
    return service.get_all(current_user)


@router.delete("/{tmdb_id}")
def delete_favorites(
    tmdb_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = FavoriteService(db)
    favorite = service.remove(current_user, tmdb_id)

    if favorite is None:
        raise HTTPException(status_code=404, detail="Favorite not found")

    return favorite
