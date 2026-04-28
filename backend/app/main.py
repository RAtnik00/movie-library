from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.movies import router as movies_router

from app.models.movie import Movie
from app.models.favorite import Favorite
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.watchlist import Watchlist
from app.models.watched import Watched

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(movies_router, prefix="/api")
