from flask import Blueprint, request, jsonify
from models import UserSkill, Skill
from schemas import UserSkillSchema
from extensions import db
from marshmallow import ValidationError
from utils.auth import token_required

user_skills_bp = Blueprint('user_skills_bp', __name__)
user_skill_schema = UserSkillSchema()
user_skills_schema = UserSkillSchema(many=True)

@user_skills_bp.route('/', methods=['POST'])
@token_required
def create_user_skill(current_user):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    # Extract skill name and user-specific data
    skill_name = json_data.get('skill_name')
    if not skill_name:
        return jsonify({'message': 'Skill name is required'}), 400

    # Get or create the skill
    skill = Skill.query.filter_by(name=skill_name).first()
    if not skill:
        return jsonify({'message': 'Skill not found'}), 404

    # Check if the user already has this skill
    if UserSkill.query.filter_by(user_id=current_user.id, skill_id=skill.id).first():
        return jsonify({'message': 'User already has this skill'}), 400

    # Create UserSkill
    user_skill_data = {
        'first_used_date': json_data.get('first_used_date'),
        'last_used_date': json_data.get('last_used_date'),
        'experience': json_data.get('experience'),
        'skill_id': skill.id,
    }

    try:
        user_skill = user_skill_schema.load(user_skill_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    # Set the user_id
    user_skill.user_id = current_user.id

    db.session.add(user_skill)
    db.session.commit()

    result = user_skill_schema.dump(user_skill)
    return jsonify(result), 201

@user_skills_bp.route('/', methods=['GET'])
@token_required
def get_user_skills(current_user):
    user_skills = UserSkill.query.filter_by(user_id=current_user.id).all()
    result = user_skills_schema.dump(user_skills)
    return jsonify(result), 200

@user_skills_bp.route('/<int:skill_id>', methods=['GET'])
@token_required
def get_user_skill(current_user, skill_id):
    user_skill = UserSkill.query.filter_by(user_id=current_user.id, skill_id=skill_id).first()
    if not user_skill:
        return jsonify({'message': 'User skill not found'}), 404
    result = user_skill_schema.dump(user_skill)
    return jsonify(result), 200

@user_skills_bp.route('/<int:skill_id>', methods=['PUT'])
@token_required
def update_user_skill(current_user, skill_id):
    user_skill = UserSkill.query.filter_by(user_id=current_user.id, skill_id=skill_id).first()
    if not user_skill:
        return jsonify({'message': 'User skill not found'}), 404

    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    # Prevent changing user_id and skill_id
    json_data.pop('user_id', None)
    json_data.pop('skill_id', None)
    json_data.pop('skill_name', None)

    try:
        updated_user_skill = user_skill_schema.load(json_data, instance=user_skill, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    db.session.commit()
    result = user_skill_schema.dump(updated_user_skill)
    return jsonify(result), 200

@user_skills_bp.route('/<int:skill_id>', methods=['DELETE'])
@token_required
def delete_user_skill(current_user, skill_id):
    user_skill = UserSkill.query.filter_by(user_id=current_user.id, skill_id=skill_id).first()
    if not user_skill:
        return jsonify({'message': 'User skill not found'}), 404

    db.session.delete(user_skill)
    db.session.commit()
    return '', 204