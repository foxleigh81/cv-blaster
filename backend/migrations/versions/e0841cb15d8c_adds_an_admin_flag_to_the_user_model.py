"""Adds an admin flag to the user model

Revision ID: e0841cb15d8c
Revises: 7bf4313f8f0c
Create Date: 2024-09-17 18:29:36.206964

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e0841cb15d8c'
down_revision = '7bf4313f8f0c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('oauth_provider', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('oauth_provider_id', sa.String(length=128), nullable=False))
        batch_op.add_column(sa.Column('is_admin', sa.Boolean(), nullable=True))
        batch_op.drop_constraint('users_email_key', type_='unique')
        batch_op.create_unique_constraint('_oauth_provider_uc', ['oauth_provider', 'oauth_provider_id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('_oauth_provider_uc', type_='unique')
        batch_op.create_unique_constraint('users_email_key', ['email'])
        batch_op.drop_column('is_admin')
        batch_op.drop_column('oauth_provider_id')
        batch_op.drop_column('oauth_provider')

    # ### end Alembic commands ###
