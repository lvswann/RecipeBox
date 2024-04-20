from flask import Blueprint, request, jsonify, make_response
from flask_cors import cross_origin
from ..extensions import db
from ..models import User, RefreshTokenBlocklist

import uuid
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jti
from werkzeug.security import generate_password_hash, check_password_hash


bp = Blueprint('auth', __name__)


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

    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.public_id)
        refresh_token = create_refresh_token(identity=user.public_id)
    else:
        return jsonify({'message': 'Login Failed'}), 401

    print("Generated Token:", access_token)
    print("Refresh Token:", refresh_token)


    return jsonify({'message': 'Login successful', 'access_token': access_token, 'refresh_token': refresh_token}), 200


@bp.route('/auth/refresh/', methods=['POST'])
@cross_origin()
@jwt_required()
def refresh_token():
    current_user = get_jwt_identity()
    user = User.query.filter_by(public_id=current_user).first()
    data = request.json

    if not user:
        return jsonify({'message': 'User not found'}), 404

    jti = get_jti(data['refresh_token'])
    if RefreshTokenBlocklist.query.filter_by(jti=jti).first():
        return jsonify({'message': 'Invalid refresh token'}), 401

    access_token = create_access_token(identity=current_user)
    return jsonify({'message': 'Token refresh successful', 'access_token': access_token}), 200


@bp.route('/auth/logout/', methods=['POST'])
@cross_origin()
@jwt_required()
def logout():
    data = request.json
    jti = get_jti(data['refresh_token'])

    current_time = datetime.now(timezone.utc)
    expiration = current_time + timedelta(days=30)

    blocklist_token = RefreshTokenBlocklist(refresh_token=jti, expiration=expiration)
    db.session.add(blocklist_token)
    db.session.commit()
    
    return jsonify({'message': 'Logout Successful'}), 200



## call this periodically?
def clean_blocklist():
    expired_tokens = RefreshTokenBlocklist.query.filter(RefreshTokenBlocklist.expiration < datetime.now(timezone.utc)).all()
    for refresh_token in expired_tokens:
        db.session.delete(refresh_token)
        
    db.session.commit()