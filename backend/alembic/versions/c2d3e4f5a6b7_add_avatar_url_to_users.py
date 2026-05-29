"""add avatar url to users

Revision ID: c2d3e4f5a6b7
Revises: f3a9c1d2e4b5
Create Date: 2026-05-29 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c2d3e4f5a6b7"
down_revision: Union[str, Sequence[str], None] = "f3a9c1d2e4b5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("avatar_url", sa.String(length=500), nullable=True),
        schema="movie_app",
    )


def downgrade() -> None:
    op.drop_column("users", "avatar_url", schema="movie_app")