# app.py

from flask import Flask, request, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object('config.Config')
CORS(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Import models after initializing db to avoid circular imports
from models import User

# Define routes and views below

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/users', methods=['POST'])
def create_user():
    if not request.json or not 'email' in request.json:
        abort(400, description="Missing required fields.")

    name = request.json.get('name', '')
    email = request.json['email']
    career_history = request.json.get('career_history', '')
    skills = request.json.get('skills', '')

    new_user = User(name=name, email=email, career_history=career_history, skills=skills)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get_or_404(user_id)

    data = request.json
    if not data:
        abort(400, description="No input data provided.")

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.career_history = data.get('career_history', user.career_history)
    user.skills = data.get('skills', user.skills)

    db.session.commit()
    return jsonify(user.to_dict()), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)