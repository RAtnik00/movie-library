"""create password reset token table

Revision ID: b84915d6f2e7
Revises: 4d7f1c9a2e8b
Create Date: 2026-05-19 09:43:18.518911

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b84915d6f2e7'
down_revision: Union[str, Sequence[str], None] = '4d7f1c9a2e8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "password_reset_token",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("token_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("expires_at", sa.DateTime(), nullable=False),
        sa.Column("used_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["movie_app.users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("token_hash"),
        schema="movie_app",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("password_reset_token", schema="movie_app")
