from flask import Flask
from config import Config
from app.extensions import db, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # initialize flask extensions
    db.init_app(app)
    cors.init_app(app)
    
    from app.routes import recipe_routes, section_routes

    # register blueprints 
    app.register_blueprint(recipe_routes.bp)
    app.register_blueprint(section_routes.bp)

    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app
