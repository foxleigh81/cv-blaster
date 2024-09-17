def register_blueprints(app):
    from endpoints.users import users_bp
    from endpoints.auth import auth_bp

    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(auth_bp, url_prefix='/auth')