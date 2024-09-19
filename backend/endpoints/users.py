from flask import Blueprint, request, jsonify
from models import User
from schemas import user_schema, admin_users_schema
from extensions import db
from marshmallow import ValidationError
from utils.auth import token_required, admin_required

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    try:
        result = user_schema.dump(current_user)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@users_bp.route('/', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    users = User.query.all()
    result = admin_users_schema.dump(users)
    return jsonify(result), 200

@users_bp.route('/me', methods=['PUT'])
@token_required
def update_current_user(current_user):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    # Exclude fields that should not be updated
    immutable_fields = ['id', 'email', 'oauth_provider', 'oauth_provider_id', 'is_admin']
    for field in immutable_fields:
        json_data.pop(field, None)

    try:
        updated_user = user_schema.load(json_data, instance=current_user, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    db.session.commit()
    result = user_schema.dump(updated_user)
    return jsonify(result), 200

@users_bp.route('/me', methods=['DELETE'])
@token_required
def delete_current_user(current_user):
    db.session.delete(current_user)
    db.session.commit()
    return '', 204