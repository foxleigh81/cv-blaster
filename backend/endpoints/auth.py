from flask import Blueprint, request
from models import User
from schemas import UserSchema
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__)
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    try:
        user = user_schema.load(json_data)
    except ValidationError as err:
        return {'errors': err.messages}, 422

    if User.query.filter_by(email=user.email).first():
        return {'message': 'User with this email already exists'}, 400

    user.password = generate_password_hash(json_data['password'])
    db.session.add(user)
    db.session.commit()

    result = user_schema.dump(user)
    return result, 201

@auth_bp.route('/login', methods=['POST'])
def login():
    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    user = User.query.filter_by(email=json_data['email']).first()
    if not user or not check_password_hash(user.password, json_data['password']):
        return {'message': 'Invalid credentials'}, 401

    access_token = create_access_token(identity=user.id)
    return {'access_token': access_token}, 200