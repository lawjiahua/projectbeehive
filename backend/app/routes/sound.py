from flask import Flask, request, jsonify, send_file, Blueprint, current_app
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import librosa
import numpy as np
import io
import datetime

from app.db import get_db

sound_bp = Blueprint('sound', __name__)

@sound_bp.route('/test-float32')
def test_float32():
    import numpy as np
    data = {'value': np.float32(0.5)}
    return jsonify(convert_floats(data))

# @sound_bp.route('/<beehive_name>/latestAlertSound', methods=['GET'])
# def get_beehive_latest_alert_sound(beehive_name):
#     # Fetch the latest alert for the beehive
#     alerts_collection = get_db('alertTest')
#     alert = alerts_collection.find_one({'beehive': beehive_name}, sort=[('timestamp', -1)])
#     print(alert)
#     if not alert or 'fileId' not in alert:
#         return jsonify({'error': 'No alert with sound file found for this beehive'}), 404

#     # Download the sound file from Google Drive
#     file_id = alert['fileId']
#     request = current_app.config['drive_service'].files().get_media(fileId=file_id)
#     fh = io.BytesIO()
#     downloader = MediaIoBaseDownload(fh, request)
#     done = False
#     while done is False:
#         status, done = downloader.next_chunk()

#     # Process the sound file
#     fh.seek(0)
#     y, sr = librosa.load(fh, sr=None)  # load the file as a waveform
#     times = np.linspace(0, len(y)/sr, num=len(y))  # create an array of time values

#     # Prepare data for plotting
#     data = [{'Time': t, 'Amplitude': amp} for t, amp in zip(times, y)]
    
#     # Send the data
#     return jsonify(convert_floats(data))

@sound_bp.route('/<fileId>', methods=['GET'])
def get_sound_file(fileId):
    # Setup Google Drive service
    drive_service = current_app.config['drive_service']
    
    # Download the sound file from Google Drive using the provided fileId
    request = drive_service.files().get_media(fileId=fileId)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while not done:
        status, done = downloader.next_chunk()
    
    # Process the sound file
    fh.seek(0)  # Move to the beginning of the file handle
    y, sr = librosa.load(fh, sr=100)  # load the file as a waveform
    times = np.linspace(0, len(y)/sr, num=len(y))  # create an array of time values
    
    # Prepare data for plotting
    data = [{'Time': t, 'Amplitude': amp} for t, amp in zip(times, y)]

    # Convert floats for JSON serialization
    def convert_floats(data):
        return [{k: float(v) if isinstance(v, np.float32) else v for k, v in item.items()} for item in data]

    return jsonify(convert_floats(data))


# following method converts float32 to float for json library to be able to handle JSON serialization
def convert_floats(data):
    if isinstance(data, dict):
        return {k: convert_floats(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_floats(item) for item in data]
    elif isinstance(data, np.float32):
        return float(data)  # Convert np.float32 to native Python float
    else:
        return data

