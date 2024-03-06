from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from ..extensions import db
from ..models import User

bp = Blueprint('auth', __name__)

def user_authentication(email, password):
    user = User.query.filter_by(email=email).first()
    
    # password/account checking

    return user


@bp.route('/register/', methods=['POST'])
@cross_origin()
def register():
    
    data = request.json

    print("Received data:", data)
    
    password = data['password']
    new_user = User(username=data['username'], email=data['email'])
    new_user.set_password(password)

    # save to database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User was saved', 'data': data})
    

@bp.route('/login/', methods=['POST'])
@cross_origin()
def login():

    data = request.json
    print("Received data:", data)

    user = user_authentication(data['email'], data['password'])

    if user:
        session['logged_in'] = True
        session['user_id'] = user.id

        return jsonify({'user_id': user.id}), 200
    
    else:
        return jsonify({'message': 'Login Failed'}), 401

@bp.route('/logout/', methods=['GET'])
def logout():
    # Clear session variables
    session.pop('logged_in', None)
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully'}), 200