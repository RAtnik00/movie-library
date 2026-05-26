"""create movie comment table

Revision ID: f3a9c1d2e4b5
Revises: b84915d6f2e7
Create Date: 2026-05-26 20:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f3a9c1d2e4b5"
down_revision: Union[str, Sequence[str], None] = "b84915d6f2e7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "movie_comment",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("movie_id", sa.Integer(), nullable=False),
        sa.Column("text", sa.String(length=1000), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["movie_id"], ["movie_app.movie.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["movie_app.users.id"]),
        sa.PrimaryKeyConstraint("id"),
        schema="movie_app",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table("movie_comment", schema="movie_app")
