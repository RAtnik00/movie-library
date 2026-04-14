from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.auth import router as auth_router
from app.routes.movies import router as movies_router

app = FastAPI()
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(movies_router, prefix="/api")
