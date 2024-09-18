from extensions import db

# Association table between History and Skill
history_skills = db.Table('history_skills',
    db.Column('history_id', db.Integer, db.ForeignKey('histories.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    # Existing fields...
    id = db.Column(db.Integer, primary_key=True)
    oauth_provider = db.Column(db.String(50), nullable=False)
    oauth_provider_id = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationships
    histories = db.relationship('History', back_populates='user', lazy='dynamic')
    user_skills = db.relationship('UserSkill', back_populates='user', cascade='all, delete-orphan')

    __table_args__ = (
        db.UniqueConstraint('oauth_provider', 'oauth_provider_id', name='_oauth_provider_uc'),
    )

    def __repr__(self):
        return f'<User {self.name}>'

    def to_dict(self):
        # Adjust as needed
        pass
# models.py

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    # Relationships
    user_skills = db.relationship('UserSkill', back_populates='skill', cascade='all, delete-orphan')
    histories = db.relationship(
        'History',
        secondary='histories_skills',
        back_populates='skills_used'
    )

    def __repr__(self):
        return f'<Skill {self.name}>'

class UserSkill(db.Model):
    __tablename__ = 'user_skills'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), primary_key=True)
    first_used_date = db.Column(db.Date)
    last_used_date = db.Column(db.Date)
    experience = db.Column(db.Integer)

    # Relationships
    user = db.relationship('User', back_populates='user_skills')
    skill = db.relationship('Skill', back_populates='user_skills')

    def __repr__(self):
        return f'<UserSkill User:{self.user_id} Skill:{self.skill_id}>'

class History(db.Model):
    __tablename__ = 'histories'

    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Many-to-many relationship with Skill
    skills_used = db.relationship('Skill', secondary=histories_skills, back_populates='histories')

    # Relationship back to User
    user = db.relationship('User', back_populates='histories')

    def __repr__(self):
        return f'<History {self.company}>'