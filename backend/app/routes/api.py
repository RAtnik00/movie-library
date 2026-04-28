from fastapi import APIRouter

from app.routes.favorites import router as favorites_router
from app.routes.movies import router as movies_router
from app.routes.watched import router as watched_router
from app.routes.watchlist import router as watchlist_router


router = APIRouter(prefix="/api")

router.include_router(movies_router)
router.include_router(favorites_router)
router.include_router(watchlist_router)
router.include_router(watched_router)
