from extensions import db, ma
from models import User, Skill, UserSkill, History
from marshmallow import fields, validates, ValidationError

from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    user_skills = fields.Nested('UserSkillSchema', many=True, exclude=('user',))


    class Meta:
        model = User
        load_instance = True
        exclude = ('oauth_provider_id', 'is_admin')  # Exclude is_admin by default

# Create a separate schema for admin users that includes the is_admin field
class AdminUserSchema(ma.SQLAlchemyAutoSchema):
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    user_skills = fields.Nested('UserSkillSchema', many=True, exclude=('user',))

    class Meta:
        model = User
        load_instance = True
        exclude = ('oauth_provider_id',)
class SkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Skill
        load_instance = True
        exclude = ('histories', 'user_skills')

class UserSkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserSkill
        load_instance = True
        include_fk = True

    skill = fields.Nested('SkillSchema', exclude=('user_skills', 'histories'))
    user_id = fields.Int(dump_only=True)  # Prevent clients from setting user_id

class HistorySchema(ma.SQLAlchemyAutoSchema):
    skills_used = fields.Nested('SkillSchema', many=True, exclude=('histories', 'user_skills'))
    user = fields.Nested('UserSchema', exclude=('histories', 'skills'))
    user_id = fields.Int(dump_only=True)  # Prevent client from setting user_id directly
    start_date = fields.Date(format='%Y-%m-%d')
    end_date = fields.Date(format='%Y-%m-%d')
    class Meta:
        model = History
        load_instance = True
        include_fk = True

user_schema = UserSchema()
users_schema = UserSchema(many=True)
admin_user_schema = AdminUserSchema()
admin_users_schema = AdminUserSchema(many=True)
skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)
user_skill_schema = UserSkillSchema()
user_skills_schema = UserSkillSchema(many=True)
history_schema = HistorySchema()
histories_schema = HistorySchema(many=True)