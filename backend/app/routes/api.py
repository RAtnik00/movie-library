from fastapi import APIRouter

from app.routes.comments import router as comments_router
from app.routes.favorites import router as favorites_router
from app.routes.movies import router as movies_router
from app.routes.watched import router as watched_router
from app.routes.watchlist import router as watchlist_router
from app.routes.reminders import router as reminders_router


router = APIRouter(prefix="/api")

router.include_router(movies_router)
router.include_router(favorites_router)
router.include_router(watchlist_router)
router.include_router(watched_router)
router.include_router(comments_router)
router.include_router(reminders_router)
