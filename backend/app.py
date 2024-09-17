from flask import Flask
from config import Config
from extensions import db, migrate, ma
from endpoints import register_blueprints

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    # Register Blueprints
    register_blueprints(app)

    return app

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        return {'message': str(error)}, 400

    @app.errorhandler(404)
    def not_found(error):
        return {'message': 'Resource not found'}, 404

    @app.errorhandler(422)
    def unprocessable_entity(error):
        messages = getattr(error, 'data', {}).get('messages', ['Invalid request'])
        return {'errors': messages}, 422

# Initialize the app
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)