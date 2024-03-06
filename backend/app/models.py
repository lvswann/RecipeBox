from .extensions import db, bcrypt
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


section_recipe = db.Table('section_recipe',
                    db.Column('section_id', db.Integer, db.ForeignKey('section.id')),
                    db.Column('recipe_id', db.Integer, db.ForeignKey('recipe.id')),
                    )


# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True) # nullable=False)
#     email = db.Column(db.String(120), unique=True) # nullable=False)
#     recipes = db.relationship('Recipe', back_populates='user', lazy=True)
#     sections = db.relationship('Section', back_populates='user', lazy=True)

#     def __repr__(self):
#         return f'<User "{self.username}">'


class User(UserMixin, db.Model):
    """User account model."""

    # __tablename__ = 'flasklogin-users'
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    username = db.Column(
        db.String(100),
        nullable=False,
        unique=False
    )
    email = db.Column(
        db.String(40),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(200),
        primary_key=False,
        unique=False,
        nullable=False
	)
    # website = db.Column(
    #     db.String(60),
    #     index=False,
    #     unique=False,
    #     nullable=True
	# )
#     # created_on = db.Column(
#     #     db.DateTime,
#     #     index=False,
#     #     unique=False,
#     #     nullable=True
#     # )
#     # last_login = db.Column(
#     #     db.DateTime,
#     #     index=False,
#     #     unique=False,
#     #     nullable=True
#     # )

    recipes = db.relationship('Recipe', back_populates='user', lazy=True)
    sections = db.relationship('Section', back_populates='user', lazy=True)

    def set_password(self, password):
        """Create hashed password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, password):
        """Check hashed password."""
        return bcrypt.check_password_hash(self.password, password)
    
    def __repr__(self):
        return f'<User "{self.username}">'
    
#     # def __repr__(self):
#     #     return '<User {}>'.format(self.username)
    


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
    

    

