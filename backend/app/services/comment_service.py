import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.movie_comment import MovieComment
from app.models.user import User
from app.repositories.comment_repository import CommentRepository
from app.services.movie_service import MovieService
from app.services.movies_api import MoviesAPIClient


class CommentService:
    def __init__(self, db: Session):
        self.db = db
        self.comment_repository = CommentRepository(db)
        self.movie_service = MovieService(db)

    def create(
        self,
        user: User,
        tmdb_id: int,
        text: str,
        client: MoviesAPIClient,
    ) -> MovieComment:
        movie = self.movie_service.get_or_create_movie(client, tmdb_id)
        comment = MovieComment(
            user_id=user.id,
            movie_id=movie.id,
            text=text,
        )

        self.comment_repository.add(comment)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def get_for_movie(self, tmdb_id: int) -> list[MovieComment]:
        movie = self.movie_service.get_movie_by_tmdb_id(tmdb_id)
        if movie is None:
            return []

        return self.comment_repository.get_by_movie_id(movie.id)

    def update(
        self,
        user: User,
        comment_id: int,
        text: str,
    ) -> MovieComment | None:
        comment = self.comment_repository.get_by_id(comment_id)
        if comment is None:
            return None

        self._ensure_owner(comment, user)

        comment.text = text
        comment.updated_at = datetime.datetime.now(datetime.UTC).replace(tzinfo=None)
        self.db.commit()
        self.db.refresh(comment)
        return comment

    def remove(self, user: User, comment_id: int) -> MovieComment | None:
        comment = self.comment_repository.get_by_id(comment_id)
        if comment is None:
            return None

        self._ensure_owner(comment, user)

        self.comment_repository.delete(comment)
        self.db.commit()
        return comment

    def _ensure_owner(self, comment: MovieComment, user: User) -> None:
        if comment.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not allowed")
