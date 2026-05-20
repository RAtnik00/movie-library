from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.password_reset_token import PasswordResetToken


class PasswordResetTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_token_hash(self, token_hash: str) -> PasswordResetToken | None:
        stmt = select(PasswordResetToken).where(
            PasswordResetToken.token_hash == token_hash
        )
        result = self.db.execute(stmt)
        return result.scalar_one_or_none()

    def add(self, password_reset_token: PasswordResetToken) -> None:
        self.db.add(password_reset_token)
