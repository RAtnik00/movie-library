from app.database import Base
from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
import datetime

class Movie(Base):
    __tablename__ = "movie"
    __table_args__ = {"schema": "movie_app"}
    id = Column(Integer, primary_key=True, autoincrement=True)
    tmdb_id = Column(Integer, nullable=False, unique=True)
    title = Column(String, nullable=False)
    overview = Column(String, nullable=True)
    poster_path = Column(String, nullable=True)
    release_date = Column(Date)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    favorites = relationship("Favorite", back_populates="movie")
    watchlist = relationship("Watchlist", back_populates="movie")