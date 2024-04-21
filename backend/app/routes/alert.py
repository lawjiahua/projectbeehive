from flask import Blueprint, jsonify, request
import datetime
import pytz

from app.db import get_db

alert_bp = Blueprint('alert', __name__)

@alert_bp.route('/beehiveAlerts', methods=['POST'])
def get_beehive_alerts():
    data = request.get_json()
    beehive_names = data.get('beehives')
    if not beehive_names:
        return jsonify({'error': 'No beehive names provided'}), 400
    
    alerts_collection = get_db('alertTest')
    # one_week_ago = datetime.datetime.now() - datetime.timedelta(days=565)

    # Prepare the results list
    results = results = {name: None for name in beehive_names}
    for beehive_name in beehive_names:
        # Query to find the latest alert for the specified beehive in the past week
        query = {
            'beehive': beehive_name,
            # 'timestamp': {'$gte': one_week_ago}
        }
        # Find the latest alert
        latest_alert = alerts_collection.find_one(query, sort=[('timestamp', -1)])
        if latest_alert:
            latest_alert['_id'] = str(latest_alert['_id'])  # Convert ObjectId to string
            latest_alert['timestamp'] = latest_alert['timestamp'].isoformat()  # Convert datetime to ISO string
            results[beehive_name] = latest_alert

    # Return the processed list of alerts
    return jsonify(results)