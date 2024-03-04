from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_admin import Admin
from flask_migrate import Migrate


db = SQLAlchemy()
cors = CORS()
admin = Admin()
migrate = Migrate()