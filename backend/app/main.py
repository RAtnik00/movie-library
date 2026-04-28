from fastapi import FastAPI

from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.movies import router as movies_router
from app.routes.favorites import router as favorites_router
from app.routes.watchlist import router as watchlist_router
from app.routes.watched import router as watched_router

from app.models.movie import Movie
from app.models.favorite import Favorite
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.watchlist import Watchlist
from app.models.watched import Watched

app = FastAPI()

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(movies_router, prefix="/api")
app.include_router(favorites_router, prefix="/api")
app.include_router(watchlist_router, prefix="/api")
app.include_router(watched_router, prefix="/api")
