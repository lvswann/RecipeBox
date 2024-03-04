from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import Recipe

bp = Blueprint('recipe', __name__)

@bp.route('/recipes/', methods=['POST'])
@cross_origin()
def create_recipe():
   
    data = request.json

    print("Received data:", data)

    new_recipe = Recipe(
        user_id=data['user_id'],
        title=data['title'],
        time=data['time'],
        time_unit=data['time_unit'],
        ingredient=data['ingredient'],
        amount=data['amount'],
        amount_unit=data['amount_unit'],
        directions=data['directions'],
    )

    # save to database
    db.session.add(new_recipe)
    db.session.commit()

    return jsonify({'message': 'Recipe was saved', 'data': data})


@bp.route('/recipes/', methods=['GET'])
@cross_origin()
def get_recipes():
    recipes = Recipe.query.all()
    serialized_recipes = []
    
    for recipe in recipes:
        serialized_recipe = {
            'id': recipe.id,
            'title': recipe.title,
            'time': recipe.time,
            'time_unit': recipe.time_unit,
            'ingredient': recipe.ingredient,
            'amount': recipe.amount,
            'amount_unit': recipe.amount_unit,
            'directions': recipe.directions
            }
        
        serialized_recipes.append(serialized_recipe)
       
    return jsonify(recipes=serialized_recipes)