from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.dependencies.movies import get_movies_api_client
from app.models.user import User
from app.schemas.movie import (
    MovieActionRequest,
    SetWatchedRatingRequest,
    WatchedResponse,
)
from app.services.movies_api import MoviesAPIClient
from app.services.watched_service import WatchedService


router = APIRouter(prefix="/watched", tags=["watched"])


@router.post("")
def add_watched(
    body: MovieActionRequest,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
    current_user: User = Depends(get_current_user),
):
    service = WatchedService(db)
    return service.add(current_user, body.tmdb_id, client)


@router.get("", response_model=list[WatchedResponse])
def get_watched(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WatchedService(db)
    return service.get_all(current_user)


@router.delete("/{tmdb_id}")
def delete_watched(
    tmdb_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WatchedService(db)
    watched = service.remove(current_user, tmdb_id)

    if watched is None:
        raise HTTPException(status_code=404, detail="Watched movie not found")

    return watched


@router.patch("/{tmdb_id}/rating")
def update_watched_rating(
    tmdb_id: int,
    body: SetWatchedRatingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WatchedService(db)
    watched = service.set_rating(current_user, tmdb_id, body.rating)

    if watched is None:
        raise HTTPException(status_code=404, detail="Watched movie not found")

    return watched
