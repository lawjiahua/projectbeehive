from flask import Blueprint, jsonify, request
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

@weight_bp.route('/nectarMonitoring/<beehive_name>')
def get_past_week_nectar_monitoring_readings(beehive_name):
    # Get the date from the query parameters, use current date if not provided
    start_date_str = request.args.get('date', None)
    print('start date string! ' + start_date_str)
    if start_date_str:
        try:
            # Assuming the date is provided in YYYY-MM-DD format
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 400
    else:
        start_date = datetime.now(pytz.utc)

    one_week_ago = start_date - timedelta(days=7)

    # Query the weight documents
    weights = list(get_db('weightTest').find({
        "date": {"$gte": one_week_ago, "$lte": start_date},
        "beehive": beehive_name,
        "actualGain": {"$exists": True}  # Ensure actualGain exists
    }, {
        "_id": 0, "date": 1, "actualGain": 1, "beehive": 1
    }))

    # Query the infraredReading documents
    infrared_readings = list(get_db('infrared').find({
        "date": {"$gte": one_week_ago, "$lte": start_date},
        "beehive": beehive_name,
    }, {
        "_id": 0, "date": 1, "reading": 1, "beehive": 1
    }))
    
    # Combine data by date and beehive
    combined_data = []
    
    weight_by_date_beehive = {(w['date'].isoformat(), w['beehive']): (w['actualGain'], w['date']) for w in weights}
    infrared_by_date_beehive = {(ir['date'].isoformat(), ir['beehive']): ir['reading'] for ir in infrared_readings}
    
    # Create tuples of combined data
    for key, (actual_gain, date) in weight_by_date_beehive.items():
        if key in infrared_by_date_beehive:
            combined_data.append({
                'date': date.isoformat(),
                'actualGain': actual_gain,
                'infraredReading': infrared_by_date_beehive[key],

            })

    return jsonify(combined_data)