from flask import Blueprint, request, jsonify
from models import History, Skill
from schemas import HistorySchema
from extensions import db
from marshmallow import ValidationError
from utils.auth import token_required, admin_required

history_bp = Blueprint('history_bp', __name__)
history_schema = HistorySchema()
histories_schema = HistorySchema(many=True)
admin_histories_schema = HistorySchema(many=True)

@history_bp.route('/', methods=['POST'])
@token_required
def create_history(current_user):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    # Exclude 'user_id' from input data
    json_data.pop('user_id', None)

    # Handle the skills_used field before loading into schema
    skills_data = json_data.pop('skills_used', [])

    try:
        history_data = history_schema.load(json_data)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    # Set the user_id to the current user's ID
    history_data.user_id = current_user.id

    # Handle the skills_used field
    skills = []
    for skill_item in skills_data:
        skill_name = skill_item.get('name')
        if not skill_name:
            continue  # Skip if no skill name provided

        # Look for the skill by name
        skill = Skill.query.filter_by(name=skill_name).first()
        if not skill:
            # Create new skill
            skill = Skill(name=skill_name)
            db.session.add(skill)
            db.session.flush()  # Flush to get the ID

        skills.append(skill)

    # Associate skills with the history entry
    history_data.skills_used = skills

    db.session.add(history_data)
    db.session.commit()

    result = history_schema.dump(history_data)
    return jsonify(result), 201

@history_bp.route('/', methods=['GET'])
@token_required
def get_histories(current_user):
    histories = History.query.filter_by(user_id=current_user.id).all()
    result = histories_schema.dump(histories)
    return jsonify(result), 200

@history_bp.route('/all', methods=['GET'])
@token_required
@admin_required
def get_all_histories(current_user):
    histories = History.query.all()
    result = admin_histories_schema.dump(histories)
    return jsonify(result), 200

@history_bp.route('/<int:history_id>', methods=['GET'])
@token_required
def get_history(current_user, history_id):
    history = History.query.filter_by(id=history_id, user_id=current_user.id).first()
    if not history:
        return jsonify({'message': 'History not found'}), 404
    result = history_schema.dump(history)
    return jsonify(result), 200

@history_bp.route('/<int:history_id>', methods=['PUT'])
@token_required
def update_history(current_user, history_id):
    history = History.query.filter_by(id=history_id, user_id=current_user.id).first()
    if not history:
        return jsonify({'message': 'History not found'}), 404

    json_data = request.get_json()
    if not json_data:
        return jsonify({'message': 'No input data provided'}), 400

    # Exclude 'user_id' from input data
    json_data.pop('user_id', None)

    # Handle the skills_used field separately
    skills_data = json_data.pop('skills_used', None)

    try:
        history = history_schema.load(json_data, instance=history, partial=True)
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 422

    # Handle updating skills if provided
    if skills_data is not None:
        skills = []
        for skill_item in skills_data:
            skill_name = skill_item.get('name')
            if not skill_name:
                continue  # Skip if no skill name provided

            # Look for the skill by name
            skill = Skill.query.filter_by(name=skill_name).first()
            if not skill:
                # Create new skill
                skill = Skill(name=skill_name)
                db.session.add(skill)
                db.session.flush()  # Flush to get the ID

            skills.append(skill)
        history.skills_used = skills

    db.session.commit()
    result = history_schema.dump(history)
    return jsonify(result), 200

@history_bp.route('/<int:history_id>', methods=['DELETE'])
@token_required
def delete_history(current_user, history_id):
    history = History.query.filter_by(id=history_id, user_id=current_user.id).first()
    if not history:
        return jsonify({'message': 'History not found'}), 404

    db.session.delete(history)
    db.session.commit()
    return '', 204