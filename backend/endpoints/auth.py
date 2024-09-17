# endpoints/auth.py

from flask import Blueprint, request, jsonify, current_app
import jwt
from models import User
from extensions import db

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/test-login', methods=['POST'])
def test_login():
    if not current_app.config['TESTING']:
        return {'message': 'Test login not allowed'}, 403

    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    email = json_data.get('email')
    if not email:
        return {'message': 'Email is required'}, 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return {'message': 'User not found'}, 404

    # Generate token
    token = jwt.encode(
        {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'provider': user.oauth_provider,
            # Include other claims as needed
        },
        current_app.config['SECRET_KEY'],
        algorithm='HS256'
    )

    return {'access_token': token}, 200