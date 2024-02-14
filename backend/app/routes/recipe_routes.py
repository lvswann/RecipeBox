from flask import Blueprint, Flask, request, jsonify
from flask_cors import cross_origin
from app.extensions import db
from app.models import Recipe

bp = Blueprint('recipe', __name__)

@bp.route('/recipes/', methods=['POST'])
@cross_origin()
def create_recipe():
   
    data = request.json

    print("Received data:", data)

    # recipe = Recipe(
    #     title=data['title'],
    #     time=data['time'],
    #     time_unit=data['time_unit'],
    #     ingredient=data['ingredient'],
    #     amount=data['amount'],
    #     amount_unit=data['amount_unit'],
    #     directions=data['directions'],
    # )

    # # save to database
    # db.session.add(recipe)
    # db.session.commit()

    return jsonify({'message': 'Data received', 'data': data})