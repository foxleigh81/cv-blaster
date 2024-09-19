from extensions import db, ma
from models import User, Skill, UserSkill, History, OAuthProvider
from marshmallow import fields, validates, ValidationError

class OAuthProviderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = OAuthProvider
        load_instance = True
        exclude = ('user',)  # Explicitly exclude the 'user' field
class UserSkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = UserSkill
        load_instance = True
        include_fk = True
        exclude = ('user',)  # Exclude the 'user' field

    skill = fields.Nested('SkillSchema', exclude=('user_skills', 'histories'))
    user_id = fields.Int(dump_only=True)  # Prevent clients from setting user_id

class UserSchema(ma.SQLAlchemyAutoSchema):
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    user_skills = fields.Nested('UserSkillSchema', many=True, exclude=('user',))
    oauth_providers = fields.Nested(OAuthProviderSchema, many=True, exclude=('user',))

    class Meta:
        model = User
        load_instance = True

    @validates('email')
    def validate_email(self, value):
        if not value or '@' not in value:
            raise ValidationError("Invalid email address.")

class AdminUserSchema(ma.SQLAlchemyAutoSchema):
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    user_skills = fields.Nested('UserSkillSchema', many=True, exclude=('user',))
    oauth_providers = fields.Nested(OAuthProviderSchema, many=True, exclude=('user',))
    is_admin = fields.Boolean()  # Include the is_admin field

    class Meta:
        model = User
        load_instance = True

class SkillSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Skill
        load_instance = True
        exclude = ('histories', 'user_skills')  # Exclude relationships to prevent circular refs

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

# Schema instances
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