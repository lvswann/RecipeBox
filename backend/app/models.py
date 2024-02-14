from app.extensions import db

class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150)) # add nullable=False
    time = db.Column(db.String(150)) # add nullable=False
    time_unit = db.Column(db.String(150)) # add nullable=False
    ingredient = db.Column(db.String(150)) # add nullable=False
    amount = db.Column(db.String(150)) # add nullable=False
    amount_unit = db.Column(db.String(150)) # add nullable=False
    directions = db.Column(db.String(150)) # add nullable=False
    
class Section(db.Model):
    __tablename__ = 'sections'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150)) # add nullable=False
    description = db.Column(db.String(150)) # add nullable=False