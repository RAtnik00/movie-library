from fastapi import FastAPI

from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.movies import router as movies_router
from app.database import Base, engine
from app.models.movie import Movie
from app.models.favorite import Favorite
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.watchlist import Watchlist

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(health_router)
app.include_router(auth_router)
app.include_router(movies_router, prefix="/api")
