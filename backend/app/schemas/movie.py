import datetime

from pydantic import BaseModel, ConfigDict, Field


class MovieActionRequest(BaseModel):
    tmdb_id: int


class CollectionMovieInfo(BaseModel):
    id: int
    tmdb_id: int
    title: str
    poster_path: str | None

    model_config = ConfigDict(from_attributes=True)


class SetWatchedRatingRequest(BaseModel):
    rating: int = Field(ge=1, le=10)


class MovieCollectionResponse(BaseModel):
    id: int
    movie_id: int
    created_at: datetime.datetime
    movie: CollectionMovieInfo

    model_config = ConfigDict(from_attributes=True)


class FavoriteResponse(MovieCollectionResponse):
    pass


class WatchlistResponse(MovieCollectionResponse):
    pass


class WatchedResponse(MovieCollectionResponse):
    rating: int | None
