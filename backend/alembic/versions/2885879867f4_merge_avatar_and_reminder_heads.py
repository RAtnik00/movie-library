"""merge avatar and reminder heads

Revision ID: 2885879867f4
Revises: a1b2c3d4e5f6, c2d3e4f5a6b7
Create Date: 2026-06-04 14:45:07.425652

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2885879867f4'
down_revision: Union[str, Sequence[str], None] = ('a1b2c3d4e5f6', 'c2d3e4f5a6b7')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
