from extensions import db

# Association table between History and Skill
histories_skills = db.Table('histories_skills',
    db.Column('history_id', db.Integer, db.ForeignKey('histories.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), unique=True, nullable=False)  # Only storing email
    is_admin = db.Column(db.Boolean, default=False)  # Retaining the is_admin flag

    # Relationships
    histories = db.relationship('History', back_populates='user', lazy='select')
    user_skills = db.relationship('UserSkill', back_populates='user', cascade='all, delete-orphan', lazy='select')
    oauth_providers = db.relationship('OAuthProvider', back_populates='user', cascade='all, delete-orphan', lazy='select')
    
    def __repr__(self):
        return f'<User {self.email}>'

class OAuthProvider(db.Model):
    __tablename__ = 'oauth_providers'

    id = db.Column(db.Integer, primary_key=True)
    provider_name = db.Column(db.String(50), nullable=False)  # e.g., 'google', 'github'
    provider_id = db.Column(db.String(128), nullable=False)  # The provider-specific ID

    # Foreign key to the User table
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationship back to the User model
    user = db.relationship('User', back_populates='oauth_providers')

    def __repr__(self):
        return f'<OAuthProvider {self.provider_name} for User {self.user_id}>'

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

    # Relationships
    user_skills = db.relationship('UserSkill', back_populates='skill', cascade='all, delete-orphan')
    histories = db.relationship(
        'History',
        secondary=histories_skills,
        back_populates='skills_used',
        lazy='select'
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
    skills_used = db.relationship('Skill', secondary=histories_skills, back_populates='histories', lazy='select')

    # Relationship back to User
    user = db.relationship('User', back_populates='histories')

    def __repr__(self):
        return f'<History {self.company}>'