from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import pytz

from app.db import get_db

# Create a Blueprint for weight-related routes
temperature_bp = Blueprint('temperature', __name__)

@temperature_bp.route('/<beehive_name>')
def get_temperature_status(beehive_name):
    temperature_collection = get_db('temperature')
    today = datetime.now(pytz.utc)
    start_of_today = today.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_today = today.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Query the database for today's reading for the specified beehive
    reading = temperature_collection.find_one({
        "beehive": beehive_name,
        "date": {"$gte": start_of_today, "$lte": end_of_today}
    })

    if reading:
        # Assuming you want to return the whole document without the MongoDB ObjectId
        reading.pop('_id', None)
        return jsonify(reading)
    else:
        return jsonify({"error": "No reading found for today"}), 404