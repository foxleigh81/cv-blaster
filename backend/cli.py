# manage.py

from flask.cli import FlaskGroup
from app import create_app, db
import click
import os

app = create_app()
cli = FlaskGroup(create_app=create_app)

@cli.command('seed_db')
def seed_db():
    """Seeds the database with initial data."""
    if os.environ.get('FLASK_ENV') == 'production':
        click.echo('Seeding is disabled in production.')
        return

    with app.app_context():
        from models import User, Skill

        # Seed test user
        user = User.query.filter_by(email='testuser@example.com').first()
        if not user:
            user = User(
                id=1,
                name='Test User',
                email='testuser@example.com',
                oauth_provider='test',
                oauth_provider_id='1',
            )
            db.session.add(user)
            db.session.commit()
            click.echo('Test user created.')

    # Create a test admin user
    admin_user = User.query.filter_by(email='admin@example.com').first()
    if not admin_user:
        admin_user = User(
            name='Admin User',
            email='admin@example.com',
            oauth_provider='test',
            oauth_provider_id='2',
            is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        click.echo('Admin user created.')

        # Seed skills for the test user
        skill_names = ['Python', 'Flask', 'SQLAlchemy']
        for skill_name in skill_names:
            if not Skill.query.filter_by(skill=skill_name, user_id=user.id).first():
                skill = Skill(
                    skill=skill_name,
                    experience=3,
                    user_id=user.id
                )
                db.session.add(skill)
        db.session.commit()
        click.echo('Skills seeded!')

if __name__ == '__main__':
    cli()