from .extensions import db

section_recipe = db.Table('section_recipe',
                    db.Column('section_id', db.Integer, db.ForeignKey('section.id')),
                    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id')),
                    )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True) # nullable=False)
    email = db.Column(db.String(120), unique=True) # nullable=False)
    recipes = db.relationship('Recipe', back_populates='user', lazy=True)
    sections = db.relationship('Section', back_populates='user', lazy=True)

    def __repr__(self):
        return f'<User "{self.username}">'

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150)) # add nullable=False
    time = db.Column(db.String(150)) # add nullable=False
    time_unit = db.Column(db.String(150)) # add nullable=False
    ingredient = db.Column(db.String(150)) # add nullable=False
    amount = db.Column(db.String(150)) # add nullable=False
    amount_unit = db.Column(db.String(150)) # add nullable=False
    directions = db.Column(db.String(150)) # add nullable=False
    sections = db.relationship('Section', secondary=section_recipe, back_populates='recipes')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='recipes')

    # maybe unique recipe titles for each user
    __table_args__ = (
        db.UniqueConstraint('title', 'user_id'),
    )

    def __repr__(self):
        return f'<Recipe "{self.title}">'
    
class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150)) # add nullable=False
    description = db.Column(db.String(150)) # add nullable=False
    recipes = db.relationship('Recipe', secondary=section_recipe, back_populates='sections')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='sections')

    def __repr__(self):
        return f'<Section "{self.title}">'
    

