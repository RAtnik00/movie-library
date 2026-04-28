import datetime

from pydantic import BaseModel, Field


class MovieActionRequest(BaseModel):
    tmdb_id: int


class WatchedMovieInfo(BaseModel):
    id: int
    tmdb_id: int
    title: str
    poster_path: str | None

    class Config:
        from_attributes = True


class SetWatchedRatingRequest(BaseModel):
    rating: int = Field(ge=1, le=10)


class WatchedResponse(BaseModel):
    id: int
    movie_id: int
    rating: int | None
    created_at: datetime.datetime
    movie: WatchedMovieInfo

    class Config:
        from_attributes = True
