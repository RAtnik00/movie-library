import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_token"
    __table_args__ = {"schema": "movie_app"}

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("movie_app.users.id"), nullable=False)
    token_hash = Column(String(255), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)

    user = relationship("User")
