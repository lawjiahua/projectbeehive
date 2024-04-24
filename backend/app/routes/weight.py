from flask import Blueprint, jsonify
from datetime import datetime, timedelta
import pytz

from app.db import get_db

# Create a Blueprint for weight-related routes
weight_bp = Blueprint('weight', __name__)

@weight_bp.route('/weights')
def weights_past_week():
    # Calculate the date one week ago from now
    one_week_ago = datetime.now(pytz.utc) - timedelta(days=7)

    # Get the database collection
    weights_collection = get_db('weightTest')
    weights = list(weights_collection.find({}))

    # Process the weights to be JSON serializable
    processed_weights = []
    for weight in weights:
        # Ensure timestamp is in a serializable format
        weight['timestamp'] = weight['timestamp'].isoformat() if weight.get('timestamp') else None
        processed_weights.append(weight)

    return jsonify(processed_weights)


@weight_bp.route('/<beehive_name>')
def weights_for_beehive(beehive_name):
    # Get the database collection
    weights_collection = get_db('weightTest')

    one_week_ago = datetime.now() - timedelta(days=7)
    # Query to find weights for the specified beehive in the past week
    query = {
        "beehive": beehive_name,
        "date": {"$gte": one_week_ago}
    }
    weights = list(weights_collection.find(query))

    # Process the weights to be JSON serializable
    processed_weights = []
    for weight in weights:
        # Convert ObjectId to string
        if '_id' in weight:
            weight['_id'] = str(weight['_id'])
        # Ensure date is in a serializable format
        if 'date' in weight:
            weight['date'] = weight['date'].isoformat()
        processed_weights.append(weight)

    return jsonify(processed_weights)