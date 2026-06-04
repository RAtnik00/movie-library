from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.ai import MovieAssistantRequest, MovieAssistantResponse
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/movie-assistant", response_model=MovieAssistantResponse)
def ask_movie_assistant(
    payload: MovieAssistantRequest,
    _current_user: User = Depends(get_current_user),
):
    service = GeminiService()
    answer = service.ask_movie_assistant(
        message=payload.message,
        movie_title=payload.movie_title,
    )

    return MovieAssistantResponse(answer=answer)
