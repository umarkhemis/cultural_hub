"""update booking_status enum values

Revision ID: 061c95f29cb0
Revises: 959c1442f6f4
Create Date: 2026-04-08 16:42:55.288067

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '061c95f29cb0'
down_revision: Union[str, Sequence[str], None] = '959c1442f6f4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'awaiting_payment'")
    op.execute("ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'confirmed'")
    op.execute("ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'cancelled'")
    op.execute("ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'expired'")
    op.execute("ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'completed'")

    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
