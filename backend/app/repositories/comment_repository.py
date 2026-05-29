from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.movie_comment import MovieComment


class CommentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, comment_id: int) -> MovieComment | None:
        stmt = select(MovieComment).where(MovieComment.id == comment_id)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def get_by_movie_id(self, movie_id: int) -> list[MovieComment]:
        stmt = (
            select(MovieComment)
            .where(MovieComment.movie_id == movie_id)
            .order_by(MovieComment.created_at.desc())
        )
        result = self.db.execute(stmt)
        return result.scalars().all()

    def add(self, comment: MovieComment) -> None:
        self.db.add(comment)

    def delete(self, comment: MovieComment) -> None:
        self.db.delete(comment)
