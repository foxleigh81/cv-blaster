# endpoints/auth.py

from flask import Blueprint, request, jsonify, current_app
import jwt
from models import User, OAuthProvider
from extensions import db
import os
from functools import wraps

NEXTAUTH_SECRET = os.getenv('NEXTAUTH_SECRET')

def require_api_secret(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header missing'}), 401
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0] != "Bearer" or parts[1] != NEXTAUTH_SECRET:
            return jsonify({'error': 'Unauthorized access'}), 401
        return f(*args, **kwargs)
    return decorated_function

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/oauth', methods=['POST'])
@require_api_secret
def sync_oauth_user():
    data = request.json

    email = data.get('email')
    provider_name = data.get('provider')
    provider_id = data.get('provider_id')

    if not email or not provider_name or not provider_id:
        return jsonify({'error': 'Invalid data'}), 400

    # Look for an existing user by email
    user = User.query.filter_by(email=email).first()

    if not user:
        # Create a new user if none exists
        user = User(email=email)
        db.session.add(user)
        db.session.flush()  # Flush to get the user ID

    # Check if this provider is already linked for this user
    oauth_provider = OAuthProvider.query.filter_by(
        user_id=user.id, provider_name=provider_name, provider_id=provider_id
    ).first()

    if not oauth_provider:
        # Link the OAuth provider to the user if not already linked
        oauth_provider = OAuthProvider(
            user_id=user.id, provider_name=provider_name, provider_id=provider_id
        )
        db.session.add(oauth_provider)

    db.session.commit()

    # **Generate a JWT Token for the User**
    token = jwt.encode(
        {
            'id': user.id,
            'email': user.email,
            'provider': provider_name,
            # Add other claims as needed
        },
        NEXTAUTH_SECRET,
        algorithm='HS256'
    )

    return jsonify({'token': token}), 200