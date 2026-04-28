from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database import get_db
from app.dependencies.movies import get_movies_api_client
from app.models.user import User
from app.schemas.movie import MovieActionRequest
from app.services.movies_api import MoviesAPIClient
from app.services.watchlist_service import WatchlistService


router = APIRouter(prefix="/watchlist", tags=["watchlist"])


@router.post("")
def add_watchlist(
    body: MovieActionRequest,
    db: Session = Depends(get_db),
    client: MoviesAPIClient = Depends(get_movies_api_client),
    current_user: User = Depends(get_current_user),
):
    service = WatchlistService(db)
    return service.add(current_user, body.tmdb_id, client)


@router.get("")
def get_watchlist(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WatchlistService(db)
    return service.get_all(current_user)


@router.delete("/{tmdb_id}")
def delete_watchlist(
    tmdb_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = WatchlistService(db)
    watchlist = service.remove(current_user, tmdb_id)

    if watchlist is None:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    return watchlist
