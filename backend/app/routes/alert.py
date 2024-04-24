from flask import Blueprint, jsonify, request
import datetime
import pytz
from bson import ObjectId

from app.db import get_db

alert_bp = Blueprint('alert', __name__)

@alert_bp.route('/', methods=['POST'])
def get_beehive_alerts():
    data = request.get_json()
    beehive_names = data.get('beehives')
    if not beehive_names:
        return jsonify({'error': 'No beehive names provided'}), 400
    
    alerts_collection = get_db('alert')
    # one_week_ago = datetime.datetime.now() - datetime.timedelta(days=565)

    # Prepare the results list
    results = results = {name: None for name in beehive_names}
    for beehive_name in beehive_names:
        # Query to find the latest alert for the specified beehive in the past week
        query = {
            'beehive': beehive_name,
            # 'timestamp': {'$gte': one_week_ago},
            'status': 'active'  # Assuming 'status' field indicates if an alert is active
        }
        # Count the active alerts
        active_alert_count = alerts_collection.count_documents(query)
        results[beehive_name] = active_alert_count

    return jsonify(results)

@alert_bp.route('/updateAlert/<alert_id>', methods=['POST'])
def update_alert_status(alert_id):
    # Attempt to convert the provided ID to a valid ObjectId
    try:
        document_id = ObjectId(alert_id)
    except:
        return jsonify({"error": "Invalid alert ID format"}), 400

    # Update the alert status to 'resolved'
    alerts_collection = get_db('alert')
    result = alerts_collection.update_one(
        {"_id": document_id, "status": "active"},  # Ensure only active alerts are updated
        {"$set": {"status": "resolved"}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "No active alert found with provided ID or already resolved"}), 404

    return jsonify({"success": "Alert status updated to resolved"}), 200

@alert_bp.route('/getAlertByBeehive/<beehive_name>', methods=['GET'])
def get_outstanding_alerts(beehive_name):
    alert_type = request.args.get('type', None)  # Get alert type if specified
    query = {"beehive": beehive_name, "status": "active"}
    if alert_type:
        query['alert_type'] = alert_type

    alerts_collection = get_db('alert')
    alerts = list(alerts_collection.find(
        query,
        {"_id": 0, "date": 1, "alert_type": 1, "message": 1, "status": 1, "fileId": 1}
    ))

    for alert in alerts:
        if 'date' in alert:
            alert['date'] = alert['date'].isoformat()

    return jsonify(alerts), 200

@alert_bp.route('/getAlertByBeehive/<beehive_name>/<function_detail>', methods=['GET'])
def get_alerts_by_function(beehive_name, function_detail):
    
    print(function_detail)
    
    query = {
        "beehive": beehive_name,
        "alert_type": get_alert_code(function_detail), 
        "status": "active"
    }

    alerts_collection = get_db('alert')
    alerts = list(alerts_collection.find(
        query,
        {"_id": 1, "date": 1, "alert_type": 1, "message": 1, "status": 1, "fileId": 1}
    ))

    # Convert dates to ISO format for JSON serialization
    for alert in alerts:
        alert['_id'] = str(alert['_id'])
        if 'date' in alert:
            alert['date'] = alert['date'].isoformat()

    return jsonify(alerts), 200

def get_alert_code(function_name):
    # Mapping of function names to alert codes in a Python dictionary
    function_mappings = {
        'Honey Production': 'low honey production',
        'Anomaly Detection': 'sound anomaly',
        'Comfort of Hive': 'comfort',
        'Environment Monitoring': 'environment',
        'Availability of Nectar': 'nectar'
    }

    # Return the alert code for the given function name
    alert_code = function_mappings.get(function_name)
    if alert_code:
        return alert_code
    else:
        raise ValueError("Invalid function name provided")