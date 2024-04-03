from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import User, Recipe, Ingredient, Direction, Section
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token


bp = Blueprint('recipe', __name__)

@bp.route('/recipes/', methods=['POST'])
@cross_origin()
@jwt_required()
def create_recipe():

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

    db_user = User.query.filter_by(public_id=user_public_id).first()


    data = request.json
    print("Received data:", data)

    # create new Recipe
    new_recipe = Recipe(
        title=data['title'],
        time=data['time'],
        time_unit=data['time_unit'],
        pinned=data['pinned'],
        user = db_user,
        user_id = db_user.id,
    )

    # create ingredients and associate them with new recipe
    for ingredient in data['ingredients']:
        new_ingredient = Ingredient(
            name=ingredient['name'],
            amount=ingredient['amount'],
            amount_unit=ingredient['amount_unit']
        )
        new_recipe.ingredients.append(new_ingredient)

    # create directions and associate them with new recipe
    for direction in data['directions']:
        new_direction = Direction(
            description=direction['description']
        )
        new_recipe.directions.append(new_direction)

    # get sections
    section_ids = data['section_ids']
    for section_id in section_ids:
        section = Section.query.filter_by(id=section_id, user_id=db_user.id).first()
        if section:
            new_recipe.sections.append(section)

    # save to database
    db.session.add(new_recipe)
    db.session.commit()

    return jsonify({'message': 'Recipe was saved', 'data': data})


@bp.route('/recipes/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_recipes():
    # get query params
    pinned = request.args.get('pinned')


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

    # Check if the user exists
    if user:
        if pinned == 'true':
            # retrieve pinned recipes associated with the user
            user_recipes = Recipe.query.filter_by(user=user, pinned=True).all()
        else:
            # Retrieve recipes associated with the user
            user_recipes = Recipe.query.filter_by(user=user).all()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 401


    serialized_recipes = []

    for recipe in user_recipes:
        serialized_recipe = {
            'id': recipe.id,
            'title': recipe.title,
            'time': recipe.time,
            'time_unit': recipe.time_unit,
            'pinned': recipe.pinned,
            'ingredients': [],
            'directions': []
        }

        # Serialize ingredients
        for ingredient in recipe.ingredients:
            serialized_ingredient = {
                'name': ingredient.name,
                'amount': ingredient.amount,
                'amount_unit': ingredient.amount_unit
            }
            serialized_recipe['ingredients'].append(serialized_ingredient)

        # Serialize directions
        serialized_directions = [{'description': direction.description} for direction in recipe.directions]
        serialized_recipe['directions'] = serialized_directions

        serialized_recipes.append(serialized_recipe)

    return jsonify({'recipes': serialized_recipes}), 200



@bp.route('/recipes/<int:recipe_id>/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_recipe(recipe_id):
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

    # Check if the user exists
    if user:
        # Retrieve the recipe associated with the user and recipe ID
        recipe = Recipe.query.filter_by(user=user, id=recipe_id).first()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 401
    

    # Check if recipe exists
    if recipe:
        # Serialize recipe details
        serialized_recipe = {
            'id': recipe.id,
            'title': recipe.title,
            'time': recipe.time,
            'time_unit': recipe.time_unit,
            'pinned': recipe.pinned,
            'ingredients': [],
            'directions': []
        }

        # Serialize ingredients
        for ingredient in recipe.ingredients:
            serialized_ingredient = {
                'name': ingredient.name,
                'amount': ingredient.amount,
                'amount_unit': ingredient.amount_unit
            }
            serialized_recipe['ingredients'].append(serialized_ingredient)

        # Serialize directions
        serialized_directions = [{'description': direction.description} for direction in recipe.directions]
        serialized_recipe['directions'] = serialized_directions

    else:
        return jsonify({'error': 'Recipe not found'}), 404

    return jsonify({'recipe': serialized_recipe}), 200






## EDITING FUNCTIONS
@bp.route('/recipes/pin/', methods=['POST'])
@cross_origin()
@jwt_required()
def pin_recipe():
    # code for confirming user


    data = request.json
    recipe_id = data['id']
    pinned = data['pinned']

    # Get the recipe from the database
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    # Update pin
    recipe.pinned = pinned
    db.session.commit()

    return jsonify({'message': 'Recipe pin updated', 'pinned': pinned}), 200