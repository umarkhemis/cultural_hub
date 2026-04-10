"""replace payment record status enum values

Revision ID: 0dbe92f28544
Revises: 4b8748295133
Create Date: 2026-04-10 09:36:43.453343

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0dbe92f28544'
down_revision: Union[str, Sequence[str], None] = '4b8748295133'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    # rename old enum
    op.execute("ALTER TYPE payment_record_status RENAME TO payment_record_status_old")

    # create new enum
    op.execute("""
        CREATE TYPE payment_record_status AS ENUM (
            'unpaid',
            'pending',
            'paid',
            'failed',
            'refunded'
        )
    """)

    # convert existing column values
    op.execute("""
        ALTER TABLE payments
        ALTER COLUMN payment_status
        TYPE payment_record_status
        USING (
            CASE
                WHEN payment_status::text = 'initialized' THEN 'pending'
                WHEN payment_status::text = 'pending' THEN 'pending'
                WHEN payment_status::text = 'completed' THEN 'paid'
                WHEN payment_status::text = 'failed' THEN 'failed'
                WHEN payment_status::text = 'refunded' THEN 'refunded'
                ELSE 'pending'
            END
        )::payment_record_status
    """)

    # drop old enum
    op.execute("DROP TYPE payment_record_status_old")


def downgrade():
    pass
