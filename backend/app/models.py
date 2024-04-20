from .extensions import db, bcrypt
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

section_recipe = db.Table('section_recipe',
                    db.Column('section_id', db.Integer, db.ForeignKey('section.id')),
                    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id')),
                    )

class User(UserMixin, db.Model):
    """User account model."""

    # __tablename__ = 'flasklogin-users'
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(36), unique=True, nullable=False)

    username = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(40), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    recipes = db.relationship('Recipe', back_populates='user', lazy=True)
    sections = db.relationship('Section', back_populates='user', lazy=True)

    def set_password(self, password):
        """Create hashed password."""
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User "{self.username}">'

class RefreshTokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    refresh_token = db.Column(db.String(255), unique=True, nullable=False)
    expiration = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<RefreshTokenBlocklist "{self.refresh_token}">'

class Recipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    time = db.Column(db.String(150), nullable=False)
    time_unit = db.Column(db.String(150), nullable=False)
    pinned = db.Column(db.Boolean, default=False)

    ingredients = db.relationship('Ingredient', back_populates='recipe', cascade="all, delete")
    directions = db.relationship('Direction', back_populates='recipe', cascade="all, delete")

    sections = db.relationship('Section', secondary=section_recipe, back_populates='recipes')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='recipes')
    

    # maybe unique recipe titles for each user
    __table_args__ = (
        db.UniqueConstraint('title', 'user_id'),
    )

    def __repr__(self):
        return f'<Recipe "{self.title}">'
    
class Ingredient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.String(150), nullable=False)
    amount_unit = db.Column(db.String(150), nullable=False)

    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    recipe = db.relationship('Recipe', back_populates='ingredients')

    def __repr__(self):
        return f'<Ingredient "{self.name}">'
    
class Direction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(150), nullable=False)
    
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipe.id'), nullable=False)
    recipe = db.relationship('Recipe', back_populates='directions')


    def __repr__(self):
        return f'<Direction "{self.description}">'
    
class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(150), nullable=False)
    recipes = db.relationship('Recipe', secondary=section_recipe, back_populates='sections')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='sections')

    # maybe unique section titles for each user
    __table_args__ = (
        db.UniqueConstraint('title', 'user_id'),
    )

    def __repr__(self):
        return f'<Section "{self.title}">'

