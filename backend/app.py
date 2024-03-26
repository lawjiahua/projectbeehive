import logging
from bson.json_util import dumps
import jwt
from functools import wraps
from flask import request, session, jsonify
from flask import Flask, redirect, url_for, session, make_response
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv
from pymongo import MongoClient 
from pymongo.server_api import ServerApi
from datetime import datetime, timezone, timedelta
import datetime as dt
import pytz
from google.auth.transport import requests

load_dotenv()
app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
# Secret key for session management. You should use a more secure key.
app.secret_key = os.getenv('SECRET_KEY')

# OAuth setup
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'email profile'},
)

# DB setup
MONGO_URI = os.getenv('DATABASE_URL')
client = MongoClient(MONGO_URI, server_api=ServerApi('1')) 
# Send a ping to confirm a successful connection try:
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
db = client["beehive"]
measurements_collection = db["measurements"]  
users_collection = db['users']
weight_collection = db['weight']
temp_collection = db['temperature']
beeActivity_collection = db['beeActivity']

#################################################################
# Actual BE logic here 
@app.route('/')
def homepage():
    email = dict(session).get('email', None)
    return f'Hello, {email}!'

@app.route('/login')
def login():
    google = oauth.create_client('google')
    # Redirect to Google for authorization
    redirect_uri = url_for('authorize', _external=True)
    print("REDIRECT URI ---------")
    print(redirect_uri)
    return google.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    google = oauth.create_client('google')
    # Google redirects back to your site here
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    logging.debug('user info obj: %s', str(user_info))
    
    # check for existing user and issue token 
    existing_user = users_collection.find_one({"email":user_info['email']})
    if existing_user is None:
        user_document = {
            "user_id": user_info['id'],
            "email": user_info['email'],
            "name": user_info['name'],
            "roles": ["viewer"],
            "beehives": ["beehive1"],
        }
        insert_result = users_collection.insert_one(user_document) 
        print(f"Document inserted with ID: {insert_result.inserted_id}")

    payload = {
        'exp': datetime.now(timezone.utc) + dt.timedelta(days=1),  # Token expires in 1 day
        'iat': datetime.now(timezone.utc),  # Issued at
        'sub': user_info['email'] 
    }
    encoded_jwt = jwt.encode(payload, app.secret_key, algorithm='HS256')
    # Create a response object to set the cookie
    response = make_response(redirect('/'))
    # Here, 'token' is assumed to be a JWT or another token string you've created
    # This sets an HttpOnly cookie named 'auth_token' with the OAuth token
    response.set_cookie('auth_token', encoded_jwt, httponly=True)
    return response

# Authorization decorater for all methods that pull beehive data. This checks whether 
# a user has permission to access the beehive data or not
def requires_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Authentication required"}), 401
        
        try:
            # Decode the token
            payload = jwt.decode(token, 'your_secret_key', algorithms=['HS256'])
            user_email = payload['sub']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except (jwt.InvalidTokenError, Exception) as e:
            return jsonify({'error': 'Invalid token'}), 401
        
        # Check if the user has access to the requested beehive
        beehive_name = kwargs.get('beehive_name', None)
        user_has_access = users_collection.find_one({"email": user_email, "beehives": beehive_name})
        if not user_has_access:
            return jsonify({"error": "Access denied to the specified beehive"}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/logout', methods=['POST'])
def logout():
    # Create a response object
    response = make_response(jsonify({"message": "You have been logged out"}))
    # Set the auth_token cookie to an empty value and expire it immediately
    response.set_cookie('auth_token', '', expires=0, httponly=True)
    return response

@app.route('/user_beehives', methods=['GET'])
def user_beehives():
    # Extract the JWT token from the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401

    token = auth_header.split(" ")[1]
    try:
        # Decode the token to get the user identifier, e.g., email
        payload = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        user_email = payload['sub']
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    # Query the 'users' collection to find the user document
    user = users_collection.find_one({"email": user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # if user is admin, return all beehives
    if user['roles'][0] == 'admin':
        unique_beehives = measurements_collection.distinct('beehive')
        return jsonify(unique_beehives)
    else: 
        # Extract the list of beehives the user has access to
        user_beehives = user.get('beehives', [])
        return jsonify(user_beehives)

@app.route('/<beehive_name>', methods=['GET'])
def get_beehive_data(beehive_name):
    if request.args.get('start_date') is None or request.args.get('end_date') is None:
        return jsonify({"error": "bad request format: missing start/end date"})
    else:
        start_date_str = request.args.get('start_date', '1900-01-01')
        end_date_str = request.args.get('end_date', '1900-01-01')
        # Convert start and end dates from string to datetime objects in UTC
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").replace(tzinfo=pytz.utc)
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").replace(tzinfo=pytz.utc) + timedelta(days=1)
        # Query the database
        query = {
            "beehive": beehive_name,
            "time": {
                "$gte": start_date,
                "$lt": end_date
            }
        }
        results = measurements_collection.find(query)

        # Convert the query results to a list of dictionaries
        documents = [doc for doc in results]

        # Convert ObjectId and dates for JSON serialization
        for document in documents:
            document['_id'] = str(document['_id'])

        return jsonify(documents)

@app.route('/weights')
def get_weights():
    weights = weight_collection.find({})
    # Use dumps from bson.json_util to handle ObjectId serialization
    return dumps(weights)

@app.route('/temperatures')
def get_temperatures():
    temperatures = temp_collection.find({})
    return dumps(temperatures)

@app.route('/beeActivities')
def get_bee_activities():
    bee_activities = beeActivity_collection.find({})
    return dumps(bee_activities)
@app.route('/test')
def test_route():
    app.logger.debug('test route accessed')
    return jsonify({"message": "Test route works!"})

if __name__ == '__main__':
    app.run(debug=True)
