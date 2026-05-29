import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class MovieReminder(Base):
    __tablename__ = "movie_reminder"
    __table_args__ = {"schema": "movie_app"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("movie_app.users.id"), nullable=False)
    movie_id = Column(Integer, ForeignKey("movie_app.movie.id"), nullable=False)
    remind_at = Column(DateTime, nullable=False)
    note = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="reminders")
    movie = relationship("Movie", back_populates="reminders")
    user = relationship("User", back_populates="reminders")
    movie = relationship("Movie", back_populates="reminders")