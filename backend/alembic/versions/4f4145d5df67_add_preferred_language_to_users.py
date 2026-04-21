
"""add preferred_language to users

Revision ID: 4f4145d5df67
Revises: 0dbe92f28544
Create Date: 2026-04-20 11:24:06.451477

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '4f4145d5df67'
down_revision: Union[str, Sequence[str], None] = '0dbe92f28544'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create the new enum type first
    op.execute("CREATE TYPE booking_payment_status AS ENUM ('unpaid', 'pending', 'paid', 'failed', 'refunded')")

    # 2. Alter the column using a USING cast (required when switching between enum types)
    op.execute("""
        ALTER TABLE bookings 
        ALTER COLUMN payment_status TYPE booking_payment_status 
        USING payment_status::text::booking_payment_status
    """)

    # 3. Drop the old enum type
    op.execute("DROP TYPE IF EXISTS payment_status")

    # 4. Add preferred_language column
    op.add_column('users', sa.Column('preferred_language', sa.String(length=10), nullable=True))


def downgrade() -> None:
    op.drop_column('users', 'preferred_language')

    op.execute("CREATE TYPE payment_status AS ENUM ('unpaid', 'pending', 'paid', 'failed', 'refunded')")
    op.execute("""
        ALTER TABLE bookings 
        ALTER COLUMN payment_status TYPE payment_status 
        USING payment_status::text::payment_status
    """)
    op.execute("DROP TYPE IF EXISTS booking_payment_status")