from extensions import db, ma
from models import User

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        sqla_session = db.session  # Use the SQLAlchemy session
        include_relationships = True