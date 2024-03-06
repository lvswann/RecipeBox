from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_admin import Admin
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_jwt_extended import JWTManager

jwt = JWTManager()
bcrypt = Bcrypt()
db = SQLAlchemy()
cors = CORS()
admin = Admin()
migrate = Migrate()
login_manager = LoginManager()