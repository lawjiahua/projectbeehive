from flask import Flask
from flask_cors import CORS
# from json import JSONEncoder
import numpy as np

from app.config import Config
from app.routes.auth import auth_bp, configure_oauth
from app.routes.weight import weight_bp
from app.routes.alert import alert_bp
from app.routes.sound import sound_bp
from app.routes.humidity import humidity_bp
from app.routes.temperature import temperature_bp

# class CustomJSONEncoder(JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, np.float32):
#             return float(obj)  # Convert np.float32 to native Python float
#         elif isinstance(obj, np.ndarray):
#             return obj.tolist()  # Convert arrays to list
#         return JSONEncoder.default(self, obj)

def create_app():
    app = Flask(__name__)
    # app.json_encoder = CustomJSONEncoder
    app.config.from_object(Config)
    CORS(app, resources={
        r"/*": {"origins": [
                    "http://localhost:3000", 
                    "http://localhost:8080",
                    "http://localhost:80",
                    "http://ec2-13-229-56-138.ap-southeast-1.compute.amazonaws.com:3000", 
                    "https://www.trigona-moni.site" 
                ],
                 "allow_headers": ["Authorization", "Content-Type"],
                 "methods": ["GET", "POST", "OPTIONS"]
                }
        })
    configure_oauth(app)
    app.config['drive_service'] = Config.create_drive_client()
    
    # register blueprints here
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(weight_bp, url_prefix='/weight')
    app.register_blueprint(alert_bp, url_prefix='/alert')
    app.register_blueprint(sound_bp, url_prefix='/sound')
    app.register_blueprint(humidity_bp, url_prefix='/humidity')
    app.register_blueprint(temperature_bp, url_prefix='/temperature')
    return app
