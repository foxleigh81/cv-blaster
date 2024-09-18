from flask import Blueprint, request, jsonify
from models import Skill
from schemas import SkillSchema
from extensions import db
from marshmallow import ValidationError
from utils.auth import token_required, admin_required

skills_bp = Blueprint('skills_bp', __name__)
skill_schema = SkillSchema()
skills_schema = SkillSchema(many=True)

@skills_bp.route('/', methods=['POST'])
@token_required
@admin_required
def create_skill(current_user):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    try:
        skill = skill_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    if Skill.query.filter_by(name=skill.name).first():
        return jsonify({'message': 'Skill already exists'}), 400

    db.session.add(skill)
    db.session.commit()

    result = skill_schema.dump(skill)
    return jsonify(result), 201

@skills_bp.route('/', methods=['GET'])
@token_required
def get_skills(current_user):
    skills = Skill.query.all()
    result = skills_schema.dump(skills)
    return jsonify(result), 200

@skills_bp.route('/<int:skill_id>', methods=['GET'])
@token_required
def get_skill(current_user, skill_id):
    skill = Skill.query.get_or_404(skill_id)
    result = skill_schema.dump(skill)
    return jsonify(result), 200

@skills_bp.route('/<int:skill_id>', methods=['PUT'])
@token_required
@admin_required
def update_skill(current_user, skill_id):
    skill = Skill.query.get_or_404(skill_id)
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    try:
        updated_skill = skill_schema.load(json_data, instance=skill, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    db.session.commit()
    result = skill_schema.dump(updated_skill)
    return jsonify(result), 200

@skills_bp.route('/<int:skill_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_skill(current_user, skill_id):
    skill = Skill.query.get_or_404(skill_id)
    db.session.delete(skill)
    db.session.commit()
    return '', 204