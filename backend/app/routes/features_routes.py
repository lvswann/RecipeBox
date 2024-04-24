from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from ..extensions import db
from ..models import User, Recipe, Ingredient, Direction, Section, section_recipe
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token
from sqlalchemy import or_


bp = Blueprint('extra_features', __name__)


@bp.route('/search/', methods=['GET'])
@cross_origin()
@jwt_required()
def search():

    keyword = request.args.get('keyword')

    
    # Get current user's public ID from JWT token
    user_public_id = get_jwt_identity()
    user = User.query.filter_by(public_id=user_public_id).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404


    recipes = Recipe.query.filter(
        Recipe.user == user,
        or_(
            Recipe.title.ilike(f'%{keyword}%'),
            Recipe.ingredients.any(Ingredient.name.ilike(f'%{keyword}%')),
            Recipe.directions.any(Direction.description.ilike(f'%{keyword}%'))
        )
    ).all()

    sections = Section.query.filter(
        Section.user == user,
        or_(
            Section.title.ilike(f'%{keyword}%'),
            Section.description.ilike(f'%{keyword}%')
        )
    ).all()

    print("recipes: ", recipes)
    print("sections: ", sections)

    serialized_recipes = [{
        'id': recipe.id,
        'title': recipe.title,
    } for recipe in recipes]

    serialized_sections = [{
        'id': section.id,
        'title': section.title,
    } for section in sections]


    return jsonify({'recipes': serialized_recipes, 'sections': serialized_sections})
