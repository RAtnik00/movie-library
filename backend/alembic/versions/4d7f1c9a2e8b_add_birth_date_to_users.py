"""add birth date to users

Revision ID: 4d7f1c9a2e8b
Revises: 72aabc0cdbbf
Create Date: 2026-05-19 08:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4d7f1c9a2e8b"
down_revision: Union[str, Sequence[str], None] = "72aabc0cdbbf"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "users",
        sa.Column("birth_date", sa.Date(), nullable=True),
        schema="movie_app",
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "birth_date", schema="movie_app")
