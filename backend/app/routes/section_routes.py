from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import Section

bp = Blueprint('section', __name__)

@bp.route('/sections/', methods=['POST'])
@cross_origin()
def create_section():
   
    data = request.json

    print("Received data:", data)

    new_section = Section(
        user_id=data['user_id'],
        title=data['title'],
        description=data['description'],
    )

    # save to database
    db.session.add(new_section)
    db.session.commit()

    return jsonify({'message': 'Data received', 'data': data})


@bp.route('/sections/', methods=['GET'])
@cross_origin()
def get_section():
    sections = Section.query.all()
    serialized_sections = []

    for section in sections:
        serialized_section = {
            'id': section.id,
            'title': section.title,
            'time': section.description,
        }

        serialized_sections.append(serialized_section)

    return jsonify(sections=serialized_sections)