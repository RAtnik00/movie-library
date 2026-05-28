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


class CommentUserInfo(BaseModel):
    id: int
    username: str

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


class MovieCommentCreateRequest(BaseModel):
    tmdb_id: int
    text: str = Field(min_length=1, max_length=1000)


class MovieCommentUpdateRequest(BaseModel):
    text: str = Field(min_length=1, max_length=1000)


class MovieCommentResponse(BaseModel):
    id: int
    movie_id: int
    user_id: int
    text: str
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
    user: CommentUserInfo

    model_config = ConfigDict(from_attributes=True)


class MovieReminderCreateRequest(BaseModel):
    tmdb_id: int
    remind_at: datetime.datetime
    note: str | None = Field(default=None, max_length=500)


class MovieReminderUpdateRequest(BaseModel):
    remind_at: datetime.datetime | None = None
    note: str | None = Field(default=None, max_length=500)


class MovieReminderResponse(BaseModel):
    id: int
    movie_id: int
    user_id: int
    remind_at: datetime.datetime
    note: str | None
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
    movie: CollectionMovieInfo

    model_config = ConfigDict(from_attributes=True)
