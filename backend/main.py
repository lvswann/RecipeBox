from app import create_app
# from flask_admin.contrib.sqla import ModelView
from app.extensions import db, admin

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)