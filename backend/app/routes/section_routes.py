from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app.extensions import db
from app.models import Section

bp = Blueprint('section', __name__)

@bp.route('/sections/', methods=['POST'])
@cross_origin()
def create_section():
   
    data = request.json

    print("Received data:", data)

    # section = Section(
    #     title=data['title'],
    #     description=data['description],
    # )

    # # save to database
    # db.session.add(section)
    # db.session.commit()

    return jsonify({'message': 'Data received', 'data': data})