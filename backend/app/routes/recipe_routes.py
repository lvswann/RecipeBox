from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import User, Recipe, Ingredient, Direction, Section, section_recipe
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token


bp = Blueprint('recipe', __name__)

@bp.route('/recipes/', methods=['POST'])
@cross_origin()
@jwt_required()
def create_recipe():

    # Get current user's public ID from JWT token
    user_public_id = get_jwt_identity()

    # Maybe not needed??
    # Decode and verify the JWT access token
    try:
        token = request.headers.get('authorization').split(' ')[1]
        decoded_token = decode_token(token)
        requested_public_id = decoded_token['sub']
    except Exception as e:
        return jsonify({'error': 'Failed to decode token'}), 400

    # Check if the user's public ID matches the requested public ID
    if user_public_id != requested_public_id:
        return jsonify({'error': 'Unauthorized access'}), 404

    db_user = User.query.filter_by(public_id=user_public_id).first()


    data = request.json
    print("Received data:", data)

    # create new Recipe
    new_recipe = Recipe(
        title=data['title'],
        time=data['time'],
        time_unit=data['time_unit'],
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
    print("create recipe: sections loop")
    for section_id in section_ids:
        print("section_id: ", section_id)
        section = Section.query.filter_by(id=section_id, user_id=db_user.id).first()
        if section:
            new_recipe.sections.append(section)

    # save to database
    db.session.add(new_recipe)
    db.session.commit()

    return jsonify({'message': 'Recipe was saved', 'recipe_id': new_recipe.id})


@bp.route('/recipes/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_recipes():
    # get query params
    pinned = request.args.get('pinned')
    section_id = request.args.get('section_id')

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
        return jsonify({'error': 'Unauthorized access'}), 404

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        if pinned == 'true':
            # retrieve pinned recipes associated with the user
            user_recipes = Recipe.query.filter_by(user=user, pinned=True).all()
        elif section_id != None:
            # retrieve recipes associated with the user and section
            user_recipes = Recipe.query.filter(Recipe.sections.any(id=section_id, user=user)).all()

        else:
            # Retrieve recipes associated with the user
            user_recipes = Recipe.query.filter_by(user=user).all()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 404


    print("user_recipes: ", user_recipes)
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
        return jsonify({'error': 'Unauthorized access'}), 404

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        # Retrieve the recipe associated with the user and recipe ID
        recipe = Recipe.query.filter_by(user=user, id=recipe_id).first()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 404
    

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
            'directions': [],
            'section_ids': []
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

        # Serialize sections

        for section in recipe.sections:
            serialized_recipe['section_ids'].append(section.id)

    else:
        return jsonify({'error': 'Recipe not found'}), 404

    return jsonify({'recipe': serialized_recipe}), 200


@bp.route('/recipes/<int:recipe_id>/', methods=['DELETE'])
@cross_origin()
@jwt_required()
def delete_recipe(recipe_id):
    user_public_id = get_jwt_identity()

    user = User.query.filter_by(public_id=user_public_id).first()

    # Check if the user exists
    if user:
        # Retrieve the recipe associated with the user and recipe ID
        recipe = Recipe.query.filter_by(user=user, id=recipe_id).first()
    else:
        return jsonify({'error': 'Cannot find user in database'}), 404
    
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    # Delete recipe from db
    db.session.delete(recipe)
    db.session.commit()

    return jsonify({'message': 'Recipe deleted successfully'}), 200




## EDITING RECIPES   
@bp.route('/recipes/<int:recipe_id>/', methods=['PUT'])
@cross_origin()
@jwt_required()
def edit_recipe(recipe_id):

    # similar to create_recipe

    user_public_id = get_jwt_identity()

    # maybe add header part
    print("Recipe_id: ", recipe_id)

    user = User.query.filter_by(public_id=user_public_id).first()
    print("Current User: ", user)


    # Check if the user exists
    if not user:
        return jsonify({'error': 'Cannot find user in database'}), 404


    # Retrieve the recipe associated with the user and recipe ID
    recipe = Recipe.query.filter_by(user=user, id=recipe_id).first()
    if not recipe:
        return jsonify({'error': 'Recipe not found'}), 404

    print("Current recipe: ", recipe)
    print("Recipe id: ", recipe.id)
    data = request.json

    # Check if the request contains the 'pinned' key
    if 'update_pinned' in data:
        # Update only the 'pinned' value of the recipe
        recipe.pinned = data['update_pinned']
        db.session.commit()
        return jsonify({'message': 'Recipe pin updated'}), 200


    # update data
    recipe.title = data['title']
    recipe.time = data['time']
    recipe.time_unit = data['time_unit']
    recipe.pinned = data['pinned']

    Ingredient.query.filter(Ingredient.recipe_id == recipe.id).delete()
    Direction.query.filter(Direction.recipe_id == recipe.id).delete()
    recipe.sections.clear()

    # Update ingredients
    for ingredient_data in data['ingredients']:
        new_ingredient = Ingredient(
            name=ingredient_data['name'],
            amount=ingredient_data['amount'],
            amount_unit=ingredient_data['amount_unit'],
            recipe_id=recipe.id,
        )
        print("name: ", ingredient_data['name'])            
        print("amount: ", ingredient_data['amount'])
        print("amount_unit: ", ingredient_data['amount_unit'])
        print("recipe_id: ", recipe.id)

        recipe.ingredients.append(new_ingredient)

    # Update directions
    for direction_data in data['directions']:
        new_direction = Direction(description=direction_data['description'], recipe_id=recipe.id)
        recipe.directions.append(new_direction)

    print("After update: ", recipe.directions)

    # Update sections
    section_ids = data['section_ids']
    if section_ids != []:
        for section_id in section_ids:
            section = Section.query.get(section_id)
            if section:
                recipe.sections.append(section)


    # Save changes
    db.session.commit()

    return jsonify({'message': 'Recipe updated successfully'}), 200


