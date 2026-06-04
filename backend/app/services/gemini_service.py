import httpx
from fastapi import HTTPException

from app.core.config import settings


class GeminiService:
    def __init__(self):
        self.api_key: str | None = settings.GEMINI_API_KEY
        self.model: str = settings.GEMINI_MODEL
        self.base_url: str = settings.GEMINI_BASE_URL

    def ask_movie_assistant(
        self,
        message: str,
        movie_title: str | None = None,
    ) -> str:
        if not self.api_key:
            raise HTTPException(
                status_code=503,
                detail="Gemini API key is not configured",
            )

        prompt = self._build_prompt(message, movie_title)

        try:
            response = httpx.post(
                f"{self.base_url}/models/{self.model}:generateContent",
                headers={"x-goog-api-key": self.api_key},
                json={
                    "contents": [
                        {
                            "parts": [
                                {"text": prompt},
                            ],
                        },
                    ],
                },
                timeout=20.0,
            )
            response.raise_for_status()
        except httpx.TimeoutException:
            raise HTTPException(
                status_code=504,
                detail="AI provider timeout",
            )
        except httpx.HTTPStatusError:
            raise HTTPException(
                status_code=502,
                detail="AI provider unavailable",
            )
        except httpx.RequestError:
            raise HTTPException(
                status_code=502,
                detail="AI provider unavailable",
            )

        return self._extract_answer(response.json())

    def _build_prompt(self, message: str, movie_title: str | None) -> str:
        context = (
            f"User asks about the movie: {movie_title}.\n"
            if movie_title
            else ""
        )

        return (
            "You are a helpful movie assistant for a movie library app. "
            "Answer clearly and briefly. Do not invent facts if you are unsure.\n\n"
            f"{context}"
            f"User question: {message}"
        )

    def _extract_answer(self, data: dict) -> str:
        try:
            return data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            raise HTTPException(
                status_code=502,
                detail="AI provider returned invalid response",
            )
