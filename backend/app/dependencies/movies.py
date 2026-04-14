from app.services.movies_api import MoviesAPIClient
from app.core.config import settings

def get_movies_api_client():
    client = MoviesAPIClient(base_url=settings.TMDB_BASE_URL, api_key=settings.TMDB_API_KEY)
    return client
