from extensions import db, ma
from models import User, Skill, History
from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
    
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    skills = fields.Nested('SkillSchema', many=True, exclude=('user',))
    class Meta:
        model = User
        load_instance = True
class SkillSchema(ma.SQLAlchemyAutoSchema):
    user = fields.Nested('UserSchema', exclude=('skills', 'histories'))
    class Meta:
        model = Skill
        load_instance = True
        include_fk = True


class HistorySchema(ma.SQLAlchemyAutoSchema):
    skills_used = fields.Nested('SkillSchema', many=True, exclude=('histories',))
    user = fields.Nested('UserSchema', exclude=('histories', 'skills'))

    class Meta:
        model = History
        load_instance = True
        include_fk = True