from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# app = Flask(__name__)

# @app.route('/')
# def hello_world():
#     return 'Hello, Flask!'

# if __name__ == '__main__':
#     app.run(debug=True)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions here

    db = SQLAlchemy(app)

    from app.routes import recipe_routes, section_routes

    # register blueprints 
    app.register_blueprint(recipe_routes.bp)
    app.register_blueprint(section_routes.bp)

    @app.route('/test/')
    def test_page():
        return '<h1>Testing the Flask Application Factory Pattern</h1>'

    return app

# def create_app(config_class=Config):
#     # initialize flask
#     app = Flask(__name__)
#     app.config.from_object(config_class)


    
#     db = SQLAlchemy(app)

#     from app.routes import recipe_routes, section_routes

#     # register blueprints
#     app.register_blueprint(recipe_routes.bp)
#     app.register_blueprint(section_routes.bp)



#     @app.route('/test/')
#     def test_page():
#         return '<h1>Testing the Flask Application Factory Pattern</h1>'

#     return app




# # with app.app_context():
# #     db.create_all()