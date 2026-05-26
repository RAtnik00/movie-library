import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class MovieComment(Base):
    __tablename__ = "movie_comment"
    __table_args__ = {"schema": "movie_app"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("movie_app.users.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movie_app.movie.id"), nullable=False)
    text = Column(String(1000), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="comments")
    movie = relationship("Movie", back_populates="comments")
