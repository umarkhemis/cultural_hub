"""add experience_views table

Revision ID: 000adfedb0da
Revises: 4f4145d5df67
Create Date: 2026-04-21 17:00:43.286575

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = '000adfedb0da'
down_revision: Union[str, Sequence[str], None] = '4f4145d5df67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'experience_views',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column('experience_id', UUID(as_uuid=True), sa.ForeignKey('experiences.id', ondelete='CASCADE'), nullable=False),
        sa.Column('viewer_user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('session_id', sa.String(100), nullable=True),
        sa.Column('viewed_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('watch_seconds', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index('ix_experience_views_experience_id', 'experience_views', ['experience_id'])
    op.create_index('ix_experience_views_viewer_user_id', 'experience_views', ['viewer_user_id'])
    op.create_index('ix_experience_views_session_id', 'experience_views', ['session_id'])


def downgrade() -> None:
    op.drop_index('ix_experience_views_session_id')
    op.drop_index('ix_experience_views_viewer_user_id')
    op.drop_index('ix_experience_views_experience_id')
    op.drop_table('experience_views')
