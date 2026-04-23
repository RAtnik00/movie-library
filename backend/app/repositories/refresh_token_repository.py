from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken

class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_token_hash(self, token_hash: str) -> RefreshToken | None:
        stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def add(self, refresh_token: RefreshToken) -> None:
        self.db.add(refresh_token)