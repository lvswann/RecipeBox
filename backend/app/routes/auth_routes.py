from flask import Blueprint, request, jsonify, make_response
from flask_cors import cross_origin
from ..extensions import db
from ..models import User

import uuid
from flask_jwt_extended import create_access_token, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash


bp = Blueprint('auth', __name__)

def user_authentication(email, password):
    user = User.query.filter_by(email=email).first()
    
    # password/account checking

    return user


@bp.route('/register/', methods=['POST'])
@cross_origin()
def register_user():
    
    data = request.json
    print("Received data:", data)

    hashed_pass = generate_password_hash(data['password'], method='pbkdf2:sha256')

    new_user = User(public_id=str(uuid.uuid4()), username=data['username'], email=data['email'], password=hashed_pass)
    
    # save to database
    db.session.add(new_user) 
    db.session.commit()   

    return jsonify({'message': 'User registered successfully', 'data': data})
    

@bp.route('/login/', methods=['POST'])
@cross_origin()
def login_user():

    # auth = request.authorization  
    # if not auth or not auth.username or not auth.password: 
    #    return make_response('could not verify', 401, {'Authentication': 'login required"'})   
 
    # print("Received data:", auth)

    # user = User.query.filter_by(email=auth.email).first()  
    # if not user or not check_password_hash(user.password, auth.password):
    #     return make_response('could not verify', 401, {'Authentication': 'login required'})
    

    data = request.json
    print("Received data:", data)

    user = user_authentication(data['email'], data['password'])

    if not user:
        return jsonify({'message': 'Login Failed'}), 401

    access_token = create_access_token(identity=user.public_id)
    return jsonify({'message': 'Login successful', 'access_token': access_token})


@bp.route('/logout/', methods=['GET'])
@cross_origin()
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200