from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.routes.auth import auth_bp, configure_oauth
from app.routes.weight import weight_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={
        r"/*": {"origins": "http://localhost:3000", 
                 "allow_headers": ["Authorization", "Content-Type"],
                 "methods": ["GET", "POST", "OPTIONS"]
                }
        })
    configure_oauth(app)
    
    # register blueprints here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(weight_bp, url_prefix='/weight')
    return app