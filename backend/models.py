from extensions import db

# Association table between History and Skill
history_skills = db.Table('history_skill',
    db.Column('history_id', db.Integer, db.ForeignKey('history.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)

    # One-to-many relationship with History
    histories = db.relationship('History', back_populates='user', lazy='dynamic')

    # One-to-many relationship with Skill
    skills = db.relationship('Skill', back_populates='user', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'histories': [history.to_dict() for history in self.histories],
            'skills': [skill.to_dict() for skill in self.skills]
        }
class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    skill = db.Column(db.String(128), nullable=False)
    first_used_date = db.Column(db.Date)
    last_used_date = db.Column(db.Date)
    experience = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Relationship back to User
    user = db.relationship('User', back_populates='skills')
    histories = db.relationship('History', secondary=history_skills, back_populates='skills_used')

    def __repr__(self):
        return f'<Skill {self.skill}>'

    def to_dict(self):
        return {
            'id': self.id,
            'skill': self.skill,
            'first_used_date': self.first_used_date,
            'last_used_date': self.last_used_date,
            'experience': self.experience,
            'user_id': self.user_id
        }

    __table_args__ = (
        db.UniqueConstraint('user_id', 'skill', name='_user_skill_uc'),
    )

class History(db.Model):
    __tablename__ = 'history'

    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(128), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # Many-to-many relationship with Skill
    skills_used = db.relationship('Skill', secondary=history_skills, back_populates='histories')

    # Relationship back to User
    user = db.relationship('User', back_populates='histories')

    def __repr__(self):
        return f'<History {self.company}>'

    def to_dict(self):
        return {
            'id': self.id,
            'company': self.company,
            'title': self.title,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'description': self.description,
            'skills_used': [skill.to_dict() for skill in self.skills_used],
            'user_id': self.user_id
        }