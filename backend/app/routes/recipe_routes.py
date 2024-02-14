from flask import Blueprint, Flask, request, jsonify

bp = Blueprint('recipe', __name__)

@bp.route('/recipes', methods=['POST'])
def create_recipe():
    data = request.json
    # save to database
    return jsonify({'message': 'Recipe created successfully'}), 201