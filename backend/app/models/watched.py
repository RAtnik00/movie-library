from app.database import Base
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
import datetime

class Watched(Base):
    __tablename__ = "watched"
    __table_args__ = (UniqueConstraint("user_id", "movie_id", name="uq_watched_user_movie"),
                      {"schema": "movie_app"})
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("movie_app.users.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movie_app.movie.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="watched")
    movie = relationship("Movie", back_populates="watched")
