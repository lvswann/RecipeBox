from flask import Blueprint, render_template, redirect, url_for
from flask_login import current_user, login_required,  logout_user

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import User
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token


# Blueprint Configuration
bp = Blueprint(
    'main_bp', __name__,
    template_folder='templates',
    static_folder='static'
)


@bp.route("/logout")
@login_required
def logout():
    """User log-out logic."""
    logout_user()
    return redirect(url_for('auth_bp.login'))


@bp.route('/useraccount/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_recipes():
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

    serialized_user = {
            'username': user.username,
            'email': user.email,
        }

    return jsonify({'user': serialized_user}), 200