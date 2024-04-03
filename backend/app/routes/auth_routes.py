from flask import Blueprint, request, jsonify, make_response
from flask_cors import cross_origin
from ..extensions import db
from ..models import User

import uuid
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash


bp = Blueprint('auth', __name__)

def user_authentication(email, password):
    user = User.query.filter_by(email=email).first()
    
    # password/account checking
    if user and check_password_hash(user.password_hash, password):
        return user
    
    return None


@bp.route('/users/', methods=['POST'])
@cross_origin()
def register_user():
    
    data = request.json
    print("Received data:", data)

    user_exists = User.query.filter_by(email=data['email']).first()

    if user_exists:
        return jsonify({'message': 'User already exists'}), 409

    hashed_pass = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(public_id=str(uuid.uuid4()), username=data['username'], email=data['email'], password_hash=hashed_pass)
    
    # save to database
    db.session.add(new_user) 
    db.session.commit()   

    return jsonify({'message': 'Registration successful'}), 200




@bp.route('/auth/login/', methods=['POST'])
@cross_origin()
def login_user():

    data = request.json
    print("Received data:", data)

    user = user_authentication(data['email'], data['password'])

    if not user:
        return jsonify({'message': 'Login Failed'}), 401

    access_token = create_access_token(identity=user.public_id)
    print("Generated Token:", access_token)

    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200


@bp.route('/auth/refresh/', methods=['POST'])
@cross_origin()
@jwt_required()
def refresh_token():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify({'message': 'Token refresh successful', 'access_token': access_token}), 200


@bp.route('/auth/logout/', methods=['POST'])
@cross_origin()
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200

