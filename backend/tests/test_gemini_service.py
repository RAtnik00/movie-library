import pytest
from fastapi import HTTPException

from app.services.gemini_service import GeminiService


def make_service(api_key: str | None = "test-key") -> GeminiService:
    service = GeminiService()
    service.api_key = api_key
    service.model = "gemini-test"
    service.base_url = "https://gemini.test"
    return service


def test_ask_movie_assistant_rejects_missing_api_key():
    service = make_service(api_key=None)

    with pytest.raises(HTTPException) as error:
        service.ask_movie_assistant(message="Recommend me a movie")

    assert error.value.status_code == 503
    assert error.value.detail == "Gemini API key is not configured"


def test_ask_movie_assistant_returns_provider_answer(monkeypatch):
    service = make_service()

    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {
                "candidates": [
                    {
                        "content": {
                            "parts": [
                                {"text": "Watch Inception if you like smart sci-fi."},
                            ],
                        },
                    },
                ],
            }

    def fake_post(url, headers, json, timeout):
        assert url == "https://gemini.test/models/gemini-test:generateContent"
        assert headers == {"x-goog-api-key": "test-key"}
        assert json["contents"][0]["parts"][0]["text"].startswith(
            "You are a helpful movie assistant"
        )
        assert timeout == 20.0
        return FakeResponse()

    monkeypatch.setattr("app.services.gemini_service.httpx.post", fake_post)

    result = service.ask_movie_assistant(
        message="Recommend me a sci-fi movie",
        movie_title="Inception",
    )

    assert result == "Watch Inception if you like smart sci-fi."


def test_ask_movie_assistant_rejects_invalid_provider_response(monkeypatch):
    service = make_service()

    class FakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {"candidates": []}

    def fake_post(url, headers, json, timeout):
        return FakeResponse()

    monkeypatch.setattr("app.services.gemini_service.httpx.post", fake_post)

    with pytest.raises(HTTPException) as error:
        service.ask_movie_assistant(message="Recommend me a movie")

    assert error.value.status_code == 502
    assert error.value.detail == "AI provider returned invalid response"
