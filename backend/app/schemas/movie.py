import datetime

<<<<<<< HEAD
from pydantic import BaseModel, ConfigDict, Field
=======
from pydantic import BaseModel, Field
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7


class MovieActionRequest(BaseModel):
    tmdb_id: int


class CollectionMovieInfo(BaseModel):
    id: int
    tmdb_id: int
    title: str
    poster_path: str | None

<<<<<<< HEAD
    model_config = ConfigDict(from_attributes=True)
=======
    class Config:
        from_attributes = True
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7


class SetWatchedRatingRequest(BaseModel):
    rating: int = Field(ge=1, le=10)


class MovieCollectionResponse(BaseModel):
    id: int
    movie_id: int
    created_at: datetime.datetime
    movie: CollectionMovieInfo

<<<<<<< HEAD
    model_config = ConfigDict(from_attributes=True)
=======
    class Config:
        from_attributes = True
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7


class FavoriteResponse(MovieCollectionResponse):
    pass


class WatchlistResponse(MovieCollectionResponse):
    pass


class WatchedResponse(MovieCollectionResponse):
    rating: int | None
