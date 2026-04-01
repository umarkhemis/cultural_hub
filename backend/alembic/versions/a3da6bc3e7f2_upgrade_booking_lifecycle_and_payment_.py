
"""upgrade booking lifecycle and payment realism

Revision ID: a3da6bc3e7f2
Revises: dd11a3729db9
Create Date: 2026-03-31 13:56:34.288346

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3da6bc3e7f2'
down_revision: Union[str, Sequence[str], None] = 'dd11a3729db9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ── booking_reference: add nullable first, backfill, then enforce NOT NULL ──
    op.add_column('bookings', sa.Column('booking_reference', sa.String(length=50), nullable=True))
    op.execute(
        "UPDATE bookings SET booking_reference = 'REF-' || UPPER(MD5(CAST(id AS TEXT))) "
        "WHERE booking_reference IS NULL"
    )
    op.alter_column('bookings', 'booking_reference', nullable=False)

    # ── remaining columns ──
    op.add_column('bookings', sa.Column('reserved_until', sa.DateTime(timezone=True), nullable=True))
    op.add_column('bookings', sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True))
    op.add_column('bookings', sa.Column('cancellation_reason', sa.String(length=500), nullable=True))
    op.add_column('bookings', sa.Column('booking_notes', sa.Text(), nullable=True))
    op.alter_column('bookings', 'package_title_snapshot',
               existing_type=sa.VARCHAR(length=200),
               type_=sa.String(length=255),
               existing_nullable=False)
    op.alter_column('bookings', 'provider_name_snapshot',
               existing_type=sa.VARCHAR(length=200),
               type_=sa.String(length=255),
               existing_nullable=False)
    op.drop_index(op.f('ix_bookings_booking_date'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_package_booking_date'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_tourist_booking_date'), table_name='bookings')
    op.create_index(op.f('ix_bookings_booking_reference'), 'bookings', ['booking_reference'], unique=True)
    op.create_index('ix_bookings_reserved_until', 'bookings', ['reserved_until'], unique=False)
    op.drop_constraint(op.f('bookings_package_id_fkey'), 'bookings', type_='foreignkey')
    op.create_foreign_key(None, 'bookings', 'packages', ['package_id'], ['id'], ondelete='CASCADE')
    op.add_column('payments', sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True))
    op.alter_column('payments', 'transaction_reference',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=100),
               existing_nullable=False)
    op.alter_column('payments', 'gateway_response',
               existing_type=sa.VARCHAR(length=2000),
               type_=sa.Text(),
               existing_nullable=True)
    op.drop_index(op.f('ix_payments_booking_status'), table_name='payments')
    op.drop_index(op.f('ix_payments_created_at'), table_name='payments')
    op.drop_index(op.f('ix_payments_gateway'), table_name='payments')
    op.drop_constraint(op.f('payments_transaction_reference_key'), 'payments', type_='unique')
    op.create_index(op.f('ix_payments_transaction_reference'), 'payments', ['transaction_reference'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_payments_transaction_reference'), table_name='payments')
    op.create_unique_constraint(op.f('payments_transaction_reference_key'), 'payments', ['transaction_reference'], postgresql_nulls_not_distinct=False)
    op.create_index(op.f('ix_payments_gateway'), 'payments', ['payment_gateway'], unique=False)
    op.create_index(op.f('ix_payments_created_at'), 'payments', ['created_at'], unique=False)
    op.create_index(op.f('ix_payments_booking_status'), 'payments', ['booking_id', 'payment_status'], unique=False)
    op.alter_column('payments', 'gateway_response',
               existing_type=sa.Text(),
               type_=sa.VARCHAR(length=2000),
               existing_nullable=True)
    op.alter_column('payments', 'transaction_reference',
               existing_type=sa.String(length=100),
               type_=sa.VARCHAR(length=255),
               existing_nullable=False)
    op.drop_column('payments', 'paid_at')
    op.drop_constraint(None, 'bookings', type_='foreignkey')
    op.create_foreign_key(op.f('bookings_package_id_fkey'), 'bookings', 'packages', ['package_id'], ['id'], ondelete='RESTRICT')
    op.drop_index('ix_bookings_reserved_until', table_name='bookings')
    op.drop_index(op.f('ix_bookings_booking_reference'), table_name='bookings')
    op.create_index(op.f('ix_bookings_tourist_booking_date'), 'bookings', ['tourist_id', 'booking_date'], unique=False)
    op.create_index(op.f('ix_bookings_package_booking_date'), 'bookings', ['package_id', 'booking_date'], unique=False)
    op.create_index(op.f('ix_bookings_booking_date'), 'bookings', ['booking_date'], unique=False)
    op.alter_column('bookings', 'provider_name_snapshot',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=200),
               existing_nullable=False)
    op.alter_column('bookings', 'package_title_snapshot',
               existing_type=sa.String(length=255),
               type_=sa.VARCHAR(length=200),
               existing_nullable=False)
    op.drop_column('bookings', 'booking_notes')
    op.drop_column('bookings', 'cancellation_reason')
    op.drop_column('bookings', 'cancelled_at')
    op.drop_column('bookings', 'reserved_until')
    op.drop_column('bookings', 'booking_reference')
































# """upgrade booking lifecycle and payment realism

# Revision ID: a3da6bc3e7f2
# Revises: dd11a3729db9
# Create Date: 2026-03-31 13:56:34.288346

# """
# from typing import Sequence, Union

# from alembic import op
# import sqlalchemy as sa


# # revision identifiers, used by Alembic.
# revision: str = 'a3da6bc3e7f2'
# down_revision: Union[str, Sequence[str], None] = 'dd11a3729db9'
# branch_labels: Union[str, Sequence[str], None] = None
# depends_on: Union[str, Sequence[str], None] = None


# def upgrade() -> None:
#     """Upgrade schema."""
#     # ### commands auto generated by Alembic - please adjust! ###
#     op.add_column('bookings', sa.Column('booking_reference', sa.String(length=50), nullable=False))
#     op.add_column('bookings', sa.Column('reserved_until', sa.DateTime(timezone=True), nullable=True))
#     op.add_column('bookings', sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True))
#     op.add_column('bookings', sa.Column('cancellation_reason', sa.String(length=500), nullable=True))
#     op.add_column('bookings', sa.Column('booking_notes', sa.Text(), nullable=True))
#     op.alter_column('bookings', 'package_title_snapshot',
#                existing_type=sa.VARCHAR(length=200),
#                type_=sa.String(length=255),
#                existing_nullable=False)
#     op.alter_column('bookings', 'provider_name_snapshot',
#                existing_type=sa.VARCHAR(length=200),
#                type_=sa.String(length=255),
#                existing_nullable=False)
#     op.drop_index(op.f('ix_bookings_booking_date'), table_name='bookings')
#     op.drop_index(op.f('ix_bookings_package_booking_date'), table_name='bookings')
#     op.drop_index(op.f('ix_bookings_tourist_booking_date'), table_name='bookings')
#     op.create_index(op.f('ix_bookings_booking_reference'), 'bookings', ['booking_reference'], unique=True)
#     op.create_index('ix_bookings_reserved_until', 'bookings', ['reserved_until'], unique=False)
#     op.drop_constraint(op.f('bookings_package_id_fkey'), 'bookings', type_='foreignkey')
#     op.create_foreign_key(None, 'bookings', 'packages', ['package_id'], ['id'], ondelete='CASCADE')
#     op.add_column('payments', sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True))
#     op.alter_column('payments', 'transaction_reference',
#                existing_type=sa.VARCHAR(length=255),
#                type_=sa.String(length=100),
#                existing_nullable=False)
#     op.alter_column('payments', 'gateway_response',
#                existing_type=sa.VARCHAR(length=2000),
#                type_=sa.Text(),
#                existing_nullable=True)
#     op.drop_index(op.f('ix_payments_booking_status'), table_name='payments')
#     op.drop_index(op.f('ix_payments_created_at'), table_name='payments')
#     op.drop_index(op.f('ix_payments_gateway'), table_name='payments')
#     op.drop_constraint(op.f('payments_transaction_reference_key'), 'payments', type_='unique')
#     op.create_index(op.f('ix_payments_transaction_reference'), 'payments', ['transaction_reference'], unique=True)
#     # ### end Alembic commands ###


# def downgrade() -> None:
#     """Downgrade schema."""
#     # ### commands auto generated by Alembic - please adjust! ###
#     op.drop_index(op.f('ix_payments_transaction_reference'), table_name='payments')
#     op.create_unique_constraint(op.f('payments_transaction_reference_key'), 'payments', ['transaction_reference'], postgresql_nulls_not_distinct=False)
#     op.create_index(op.f('ix_payments_gateway'), 'payments', ['payment_gateway'], unique=False)
#     op.create_index(op.f('ix_payments_created_at'), 'payments', ['created_at'], unique=False)
#     op.create_index(op.f('ix_payments_booking_status'), 'payments', ['booking_id', 'payment_status'], unique=False)
#     op.alter_column('payments', 'gateway_response',
#                existing_type=sa.Text(),
#                type_=sa.VARCHAR(length=2000),
#                existing_nullable=True)
#     op.alter_column('payments', 'transaction_reference',
#                existing_type=sa.String(length=100),
#                type_=sa.VARCHAR(length=255),
#                existing_nullable=False)
#     op.drop_column('payments', 'paid_at')
#     op.drop_constraint(None, 'bookings', type_='foreignkey')
#     op.create_foreign_key(op.f('bookings_package_id_fkey'), 'bookings', 'packages', ['package_id'], ['id'], ondelete='RESTRICT')
#     op.drop_index('ix_bookings_reserved_until', table_name='bookings')
#     op.drop_index(op.f('ix_bookings_booking_reference'), table_name='bookings')
#     op.create_index(op.f('ix_bookings_tourist_booking_date'), 'bookings', ['tourist_id', 'booking_date'], unique=False)
#     op.create_index(op.f('ix_bookings_package_booking_date'), 'bookings', ['package_id', 'booking_date'], unique=False)
#     op.create_index(op.f('ix_bookings_booking_date'), 'bookings', ['booking_date'], unique=False)
#     op.alter_column('bookings', 'provider_name_snapshot',
#                existing_type=sa.String(length=255),
#                type_=sa.VARCHAR(length=200),
#                existing_nullable=False)
#     op.alter_column('bookings', 'package_title_snapshot',
#                existing_type=sa.String(length=255),
#                type_=sa.VARCHAR(length=200),
#                existing_nullable=False)
#     op.drop_column('bookings', 'booking_notes')
#     op.drop_column('bookings', 'cancellation_reason')
#     op.drop_column('bookings', 'cancelled_at')
#     op.drop_column('bookings', 'reserved_until')
#     op.drop_column('bookings', 'booking_reference')
#     # ### end Alembic commands ###
