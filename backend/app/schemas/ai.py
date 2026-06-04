from pydantic import BaseModel, Field


class MovieAssistantRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    movie_title: str | None = Field(default=None, max_length=200)


class MovieAssistantResponse(BaseModel):
    answer: str
