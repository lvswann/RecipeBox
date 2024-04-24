from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import User, Section
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token

bp = Blueprint('section', __name__)

@bp.route('/sections/', methods=['POST'])
@cross_origin()
@jwt_required()
def create_section():

    
    # Get current user's public ID from JWT token
    user_public_id = get_jwt_identity()

    # Decode and verify the JWT access token
    try:
        token = request.headers.get('authorization').split(' ')[1]
        decoded_token = decode_token(token)
        requested_public_id = decoded_token['sub']
    except Exception as e:
        return jsonify({'error': 'Failed to decode token'}), 400

    # Check if the user's public ID matches the requested public ID
    if user_public_id != requested_public_id:
        return jsonify({'error': 'Unauthorized access'}), 401

    db_user = User.query.filter_by(public_id=user_public_id).first()


    data = request.json
    print("Received data:", data)

    new_section = Section(
        title=data['title'],
        description=data['description'],
        user=db_user,
        user_id=db_user.id,
    )

    # save to database
    db.session.add(new_section)
    db.session.commit()

    return jsonify({'message': 'Section was saved', 'section_id': new_section.id})


@bp.route('/sections/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_sections():

    # Get current user's public ID from JWT token
    user_public_id = get_jwt_identity()

    # Decode and verify the JWT access token
    try:
        token = request.headers.get('authorization').split(' ')[1]
        decoded_token = decode_token(token)
        requested_public_id = decoded_token['sub']
    except Exception as e:
        return jsonify({'error': 'Failed to decode token'}), 400

    # Check if the user's public ID matches the requested public ID
    if user_public_id != requested_public_id:
        return jsonify({'error': 'Unauthorized access'}), 401

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        # Retrieve sections associated with the user
        user_sections = Section.query.filter_by(user=user).all()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 401

    print('User sections: ', user_sections)

    serialized_sections = [section.serialize() for section in user_sections]

    return jsonify({'sections': serialized_sections}), 200


@bp.route('/sections/<int:section_id>/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_section(section_id):
    # Get current user's public ID from JWT token
    user_public_id = get_jwt_identity()

    # Decode and verify the JWT access token
    try:
        token = request.headers.get('authorization').split(' ')[1]
        decoded_token = decode_token(token)
        requested_public_id = decoded_token['sub']
    except Exception as e:
        return jsonify({'error': 'Failed to decode token'}), 400

    # Check if the user's public ID matches the requested public ID
    if user_public_id != requested_public_id:
        return jsonify({'error': 'Unauthorized access'}), 401

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        # Retrieve the section associated with the user and section ID
        section = Section.query.filter_by(user=user, id=section_id).first()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 401
    

    # Check if section exists
    if not section:
        return jsonify({'error': 'Section not found'}), 404

    serialized_section = section.serialize()

    return jsonify({'section': serialized_section}), 200



@bp.route('/sections/<int:section_id>/', methods=['DELETE'])
@cross_origin()
@jwt_required()
def delete_section(section_id):
    user_public_id = get_jwt_identity()

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        # Retrieve the section associated with the user and section ID
        section = Section.query.filter_by(user=user, id=section_id).first()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 401
    
    if not section:
        return jsonify({'error': 'Section not found'}), 404

    # Delete section from db
    db.session.delete(section)
    db.session.commit()

    return jsonify({'message': 'Section deleted successfully'}), 200




@bp.route('/sections/<int:section_id>/', methods=['PUT'])
@cross_origin()
@jwt_required()
def edit_section(section_id):
    user_public_id = get_jwt_identity()

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        # Retrieve the section associated with the user and section ID
        section = Section.query.filter_by(user=user, id=section_id).first()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 401
    
    if not section:
        return jsonify({'error': 'Section not found'}), 404


    data = request.json
    section.title = data['title']
    section.description = data['description']

    db.session.commit()

    return jsonify({'message': 'Section updated successfully'}), 200
