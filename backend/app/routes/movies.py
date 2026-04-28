from fastapi import APIRouter, Depends, HTTPException

from app.dependencies.movies import get_movies_api_client
from app.services.movies_api import MoviesAPIClient
from app.services.movie_service import MovieService
from app.services.watchlist_service import WatchlistService
from app.services.favorite_service import FavoriteService
from app.services.watched_service import WatchedService

from app.database import get_db
from app.core.security import get_current_user
from app.schemas.user import MovieActionRequest, SetWatchedRatingRequest, WatchedResponse
from app.models.user import User

from sqlalchemy.orm import Session

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

@router.post("/favorites")
def add_favorites(
        body: MovieActionRequest,
        db: Session = Depends(get_db),
        client: MoviesAPIClient = Depends(get_movies_api_client),
        current_user: User = Depends(get_current_user)
):
    service = FavoriteService(db)
    return service.add(current_user, body.tmdb_id, client)

@router.get("/favorites")
def get_favorites(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = FavoriteService(db)
    return service.get_all(current_user)

@router.delete("/favorites/{tmdb_id}")
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

@router.post("/watchlist")
def add_watchlist(
        body: MovieActionRequest,
        db: Session = Depends(get_db),
        client: MoviesAPIClient = Depends(get_movies_api_client),
        current_user: User = Depends(get_current_user)
):
    service = WatchlistService(db)
    return service.add(current_user, body.tmdb_id, client)

@router.get("/watchlist")
def get_watchlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WatchlistService(db)
    return service.get_all(current_user)

@router.delete("/watchlist/{tmdb_id}")
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

@router.post("/watched")
def add_watched(
        body: MovieActionRequest,
        db: Session = Depends(get_db),
        client: MoviesAPIClient = Depends(get_movies_api_client),
        current_user: User = Depends(get_current_user)
):
    service = WatchedService(db)
    return service.add(current_user, body.tmdb_id, client)

@router.get("/watched", response_model=list[WatchedResponse])
def get_watched(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    service = WatchedService(db)
    return service.get_all(current_user)

@router.delete("/watched/{tmdb_id}")
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

@router.patch("/watched/{tmdb_id}/rating")
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
