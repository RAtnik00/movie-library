from app.database import Base
from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.orm import relationship
import datetime


class User(Base):
    __tablename__ = "users"
    __table_args__ = {'schema': 'movie_app'}
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    favorites = relationship("Favorite", back_populates="user")
    watchlist = relationship("Watchlist", back_populates="user")
    watched = relationship("Watched", back_populates="user")
    comments = relationship("MovieComment", back_populates="user")
    reminders = relationship("MovieReminder", back_populates="user")
