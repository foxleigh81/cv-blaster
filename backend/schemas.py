from extensions import db, ma
from models import User, Skill, History
from marshmallow import fields, validates, ValidationError

from marshmallow import fields

class UserSchema(ma.SQLAlchemyAutoSchema):
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    skills = fields.Nested('SkillSchema', many=True, exclude=('user',))

    class Meta:
        model = User
        load_instance = True
        exclude = ('oauth_provider_id', 'is_admin')  # Exclude is_admin by default

# Create a separate schema for admin users that includes the is_admin field
class AdminUserSchema(ma.SQLAlchemyAutoSchema):
    histories = fields.Nested('HistorySchema', many=True, exclude=('user',))
    skills = fields.Nested('SkillSchema', many=True, exclude=('user',))

    class Meta:
        model = User
        load_instance = True
        exclude = ('oauth_provider_id',)
class SkillSchema(ma.SQLAlchemyAutoSchema):
    user = fields.Nested('UserSchema', exclude=('skills', 'histories'))
    user_id = fields.Int(dump_only=True) # Prevents clients from setting the user_id directly
    @validates('experience')
    def validate_experience(self, value):
        if value not in [1, 2, 3]:
            raise ValidationError('Experience must be 1, 2, or 3.')
    class Meta:
        model = Skill
        load_instance = True
        include_fk = True


class HistorySchema(ma.SQLAlchemyAutoSchema):
    skills_used = fields.Nested('SkillSchema', many=True, exclude=('histories',))
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
history_schema = HistorySchema()
histories_schema = HistorySchema(many=True)