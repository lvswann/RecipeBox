from app import db
from app.models import User, Recipe, Section, section_recipe
from app import create_app

app = create_app()

with app.app_context():
    # Clear all existing data from the tables
    db.session.query(section_recipe).delete()
    db.session.query(Recipe).delete()
    db.session.query(Section).delete()
    db.session.query(User).delete()
    db.session.commit()

    # Create users
    user1 = User(username='user1', email='user1@example.com', password='password', website='thiswebsite')
    user2 = User(username='user2', email='user2@example.com', password='password', website='thiswebsite')
    # user1 = User(username='user1', email='user1@example.com')
    # user2 = User(username='user2', email='user2@example.com')

    # Create recipes for user1
    recipe1_user1 = Recipe(title='Recipe 1 for user1', time='30', time_unit='minutes',
                           ingredient='Ingredient 1', amount='1', amount_unit='cup',
                           directions='Directions for Recipe 1 for user1', user=user1)
    recipe2_user1 = Recipe(title='Recipe 2 for user1', time='45', time_unit='minutes',
                           ingredient='Ingredient 2', amount='2', amount_unit='cups',
                           directions='Directions for Recipe 2 for user1', user=user1)

    # Create recipes for user2
    recipe1_user2 = Recipe(title='Recipe 1 for user2', time='30', time_unit='minutes',
                           ingredient='Ingredient 1', amount='1', amount_unit='cup',
                           directions='Directions for Recipe 1 for user2', user=user2)
    recipe2_user2 = Recipe(title='Recipe 2 for user2', time='45', time_unit='minutes',
                           ingredient='Ingredient 2', amount='2', amount_unit='cups',
                           directions='Directions for Recipe 2 for user2', user=user2)

    # Create sections for user1
    section1_user1 = Section(title='Section 1 for user1', description='Description for Section 1 for user1', user=user1)
    section2_user1 = Section(title='Section 2 for user1', description='Description for Section 2 for user1', user=user1)

    # Create sections for user2
    section1_user2 = Section(title='Section 1 for user2', description='Description for Section 1 for user2', user=user2)
    section2_user2 = Section(title='Section 2 for user2', description='Description for Section 2 for user2', user=user2)

    # Associate recipes with sections
    section1_user1.recipes.extend([recipe1_user1, recipe2_user1])
    section2_user1.recipes.extend([recipe1_user1])
    section1_user2.recipes.extend([recipe1_user2])
    section2_user2.recipes.extend([recipe2_user2])

    # Add objects to the session and commit changes
    db.session.add_all([user1, user2, recipe1_user1, recipe2_user1, recipe1_user2, recipe2_user2,
                        section1_user1, section2_user1, section1_user2, section2_user2])
    db.session.commit()

    # Query the database to verify the data
    print("Users:")
    for user in User.query.all():
        print(user)
        print("Recipes:")
        for recipe in user.recipes:
            print(recipe)
        print("Sections:")
        for section in user.sections:
            print(section)

# if __name__ == '__main__':
#     app.run(debug=True)