from flask import Flask
from app.config import Config
from app.routes.auth import auth_bp, configure_oauth
from app.routes.weight import weight_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    configure_oauth(app)
    
    # register blueprints here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(weight_bp, url_prefix='/weight')
    return app