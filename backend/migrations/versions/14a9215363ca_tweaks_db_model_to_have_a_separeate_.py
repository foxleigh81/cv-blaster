"""Tweaks DB model to have a separeate skill list

Revision ID: 14a9215363ca
Revises: e0841cb15d8c
Create Date: 2024-09-18 21:18:30.559705

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '14a9215363ca'
down_revision = 'e0841cb15d8c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('histories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('company', sa.String(length=128), nullable=False),
    sa.Column('title', sa.String(length=128), nullable=False),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('end_date', sa.Date(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_skills',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('skill_id', sa.Integer(), nullable=False),
    sa.Column('first_used_date', sa.Date(), nullable=True),
    sa.Column('last_used_date', sa.Date(), nullable=True),
    sa.Column('experience', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'skill_id')
    )
    op.create_table('histories_skills',
    sa.Column('history_id', sa.Integer(), nullable=False),
    sa.Column('skill_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['history_id'], ['histories.id'], ),
    sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], ),
    sa.PrimaryKeyConstraint('history_id', 'skill_id')
    )
    op.drop_table('history_skill')
    op.drop_table('history')
    with op.batch_alter_table('skills', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=128), nullable=False))
        batch_op.drop_constraint('_user_skill_uc', type_='unique')
        batch_op.create_unique_constraint(None, ['name'])
        batch_op.drop_constraint('skills_user_id_fkey', type_='foreignkey')
        batch_op.drop_column('experience')
        batch_op.drop_column('last_used_date')
        batch_op.drop_column('first_used_date')
        batch_op.drop_column('skill')
        batch_op.drop_column('user_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('skills', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('skill', sa.VARCHAR(length=128), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('first_used_date', sa.DATE(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('last_used_date', sa.DATE(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('experience', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('skills_user_id_fkey', 'users', ['user_id'], ['id'])
        batch_op.drop_constraint(None, type_='unique')
        batch_op.create_unique_constraint('_user_skill_uc', ['user_id', 'skill'])
        batch_op.drop_column('name')

    op.create_table('history',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('history_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('company', sa.VARCHAR(length=128), autoincrement=False, nullable=False),
    sa.Column('title', sa.VARCHAR(length=128), autoincrement=False, nullable=False),
    sa.Column('start_date', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('end_date', sa.DATE(), autoincrement=False, nullable=True),
    sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='history_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='history_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('history_skill',
    sa.Column('history_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('skill_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['history_id'], ['history.id'], name='history_skill_history_id_fkey'),
    sa.ForeignKeyConstraint(['skill_id'], ['skills.id'], name='history_skill_skill_id_fkey'),
    sa.PrimaryKeyConstraint('history_id', 'skill_id', name='history_skill_pkey')
    )
    op.drop_table('histories_skills')
    op.drop_table('user_skills')
    op.drop_table('histories')
    # ### end Alembic commands ###
