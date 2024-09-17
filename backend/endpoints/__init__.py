def register_blueprints(app):
    from endpoints.users import users_bp
    from endpoints.skills import skills_bp
    from endpoints.history import history_bp
    from endpoints.auth import auth_bp

    app.register_blueprint(users_bp, url_prefix='/users')
    app.register_blueprint(skills_bp, url_prefix='/skills')
    app.register_blueprint(history_bp, url_prefix='/history')
    app.register_blueprint(auth_bp, url_prefix='/auth')