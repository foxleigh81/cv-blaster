from flask import Blueprint, request, jsonify
from models import Skill
from schemas import SkillSchema
from extensions import db
from marshmallow import ValidationError
from utils.auth import token_required, admin_required

skills_bp = Blueprint('skills_bp', __name__)
skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)
admin_skills_schema = SkillSchema(many=True)

@skills_bp.route('/', methods=['POST'])
@token_required
def create_skill(current_user):
    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    # Exclude 'user_id' from input data to prevent users from assigning skills to other users
    json_data.pop('user_id', None)

    try:
        # Load skill data, associating it with the current user
        skill_data = skill_schema.load(json_data)
    except ValidationError as err:
        return {'errors': err.messages}, 422

    # Check if the skill already exists for the current user
    if Skill.query.filter_by(skill=skill_data.skill, user_id=current_user.id).first():
        return {'message': 'Skill already exists for this user'}, 400

    # Create new skill associated with the current user
    new_skill = Skill(
        skill=skill_data.skill,
        first_used_date=skill_data.first_used_date,
        last_used_date=skill_data.last_used_date,
        experience=skill_data.experience,
        user_id=current_user.id
    )

    db.session.add(new_skill)
    db.session.commit()

    result = skill_schema.dump(new_skill)
    return result, 201

@skills_bp.route('/', methods=['GET'])
@token_required
def get_skills(current_user):
    skills = Skill.query.filter_by(user_id=current_user.id).all()
    result = skills_schema.dump(skills)
    return result, 200

@skills_bp.route('/all', methods=['GET'])
@token_required
@admin_required
def get_all_skills(current_user):
    skills = Skill.query.all()
    result = admin_skills_schema.dump(skills)
    return result, 200

@skills_bp.route('/<int:skill_id>', methods=['GET'])
@token_required
def get_skill(current_user, skill_id):
    skill = Skill.query.filter_by(id=skill_id, user_id=current_user.id).first()
    if not skill:
        return {'message': 'Skill not found'}, 404
    result = skill_schema.dump(skill)
    return result, 200

@skills_bp.route('/<int:skill_id>', methods=['PUT'])
@token_required
def update_skill(current_user, skill_id):
    skill = Skill.query.filter_by(id=skill_id, user_id=current_user.id).first()
    if not skill:
        return {'message': 'Skill not found'}, 404

    json_data = request.get_json()
    if not json_data:
        return {'message': 'No input data provided'}, 400

    # Exclude 'user_id' to prevent changing ownership
    json_data.pop('user_id', None)

    try:
        # Update skill instance with new data
        updated_skill = skill_schema.load(json_data, instance=skill, partial=True)
    except ValidationError as err:
        return {'errors': err.messages}, 422

    db.session.commit()
    result = skill_schema.dump(updated_skill)
    return result, 200

@skills_bp.route('/<int:skill_id>', methods=['DELETE'])
@token_required
def delete_skill(current_user, skill_id):
    skill = Skill.query.filter_by(id=skill_id, user_id=current_user.id).first()
    if not skill:
        return {'message': 'Skill not found'}, 404

    db.session.delete(skill)
    db.session.commit()
    return '', 204