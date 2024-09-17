# endpoints/users.py

from flask import Blueprint, request, jsonify
from models import User
from schemas import UserSchema
from extensions import db
from marshmallow import ValidationError

users_bp = Blueprint('users_bp', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@users_bp.route('/', methods=['POST'])
def create_user():
    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    # Deserialize to object
    try:
        new_user = user_schema.load(json_data)
    except ValidationError as err:
        return {'errors': err.messages}, 422

    if User.query.filter_by(email=new_user.email).first():
        return {'message': 'User with this email already exists'}, 400

    db.session.add(new_user)
    db.session.commit()

    result = user_schema.dump(new_user)
    return result, 201

@users_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    result = users_schema.dump(users)
    return result, 200

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    result = user_schema.dump(user)
    return result, 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    try:
        updated_user = user_schema.load(json_data, instance=user, partial=True)
    except ValidationError as err:
        return {'errors': err.messages}, 422

    db.session.commit()
    result = user_schema.dump(updated_user)
    return result, 200

@users_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204