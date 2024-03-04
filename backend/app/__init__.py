from flask import Flask
from config import Config
from .extensions import db, cors, admin, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    cors.init_app(app)
    admin.init_app(app)
    migrate.init_app(app, db)

    from .routes import recipe_routes, section_routes

    # register blueprints 
    app.register_blueprint(recipe_routes.bp)
    app.register_blueprint(section_routes.bp)

    with app.app_context():
        db.create_all()

    return app