"""add mtn_momo and flutterwave to payment_gateway enum

Revision ID: 8fe72c5b4c92
Revises: 0da7d0b3ebcb
Create Date: 2026-04-23 13:57:56.492771

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8fe72c5b4c92'
down_revision: Union[str, Sequence[str], None] = '0da7d0b3ebcb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
