"""fix booking column type

Revision ID: 4b8748295133
Revises: 061c95f29cb0
Create Date: 2026-04-09 14:57:29.349958

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4b8748295133'
down_revision: Union[str, Sequence[str], None] = '061c95f29cb0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column(
        "bookings",
        "currency",
        existing_type=sa.Numeric(12, 2),
        type_=sa.String(length=10),
        existing_nullable=False,
        postgresql_using="'UGX'",
    )


def downgrade():
    op.alter_column(
        "bookings",
        "currency",
        existing_type=sa.String(length=10),
        type_=sa.Numeric(12, 2),
        existing_nullable=False,
        postgresql_using="NULL",
    )
