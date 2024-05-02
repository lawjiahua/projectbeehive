from flask import request, jsonify, current_app
from flask import Blueprint, redirect, url_for, make_response 
from authlib.integrations.flask_client import OAuth
import jwt
import logging
from datetime import datetime, timezone
import datetime as dt
import requests

from app.db import get_db


auth_bp = Blueprint('auth', __name__)
oauth = OAuth()

def configure_oauth(app):
    oauth.init_app(app)
    oauth.register(
        'google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        access_token_url='https://accounts.google.com/o/oauth2/token',
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        client_kwargs={'scope': 'email profile'}
    )

@auth_bp.route('/google_login', methods=['POST'])
def google_login():
    token = request.json.get('token')
    # Verify the token with Google's API
    user_info = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={token}').json()
    print('data from google!')
    print(user_info)
    print(current_app.secret_key)
    if user_info.get('aud') == current_app.config['GOOGLE_CLIENT_ID']:

        users_collection = get_db('users')
        # check for existing user and issue token 
        existing_user = users_collection.find_one({"email":user_info['email']})
        if existing_user is None:
            user_document = {
                "email": user_info['email'],
                "name": user_info['name'],
                "roles": ["admin"],
                "beehives": ["beehive1", "beehive2", "beehive3", "beehive4", "beehive5", "beehive6"],
                "picture": user_info['picture']
            }
            insert_result = users_collection.insert_one(user_document) 
            print(f"Document inserted with ID: {insert_result.inserted_id}")

        # Token is valid. Create a session or JWT for the user
        user_jwt = jwt.encode({'email': user_info['email']}, current_app.secret_key , algorithm='HS256')
        return jsonify({'jwt': user_jwt}), 200
    else:
        return jsonify({'error': 'Invalid token'}), 401
    

@auth_bp.route('/user_info')
def user_info():
    auth_token = request.headers.get('Authorization')

    if not auth_token:
        return jsonify({'message': 'Authentication token not found'}), 401
    
    try:
        token = auth_token.split(' ')[1]
        payload = jwt.decode(token, current_app.secret_key, algorithms=['HS256'])
        user_email = payload['email']  

        users_collection = get_db('users')
        user_details = users_collection.find_one({"email": user_email}, {'_id': 0})  # Exclude the MongoDB ID from the results
        
        if user_details:
            return jsonify(user_details), 200
        else:
            return jsonify({'message': 'User not found'}), 404
        
    except jwt.ExpiredSignatureError:
        print("token expired")
        return jsonify({'message': 'Token expired'}), 401  # 401 Unauthorized
    except jwt.InvalidTokenError:
        print("invalid token")
        return jsonify({'message': 'Invalid token'}), 401
    except Exception as e:
        print(e)
        return jsonify({'message': 'An error occurred'}), 500


