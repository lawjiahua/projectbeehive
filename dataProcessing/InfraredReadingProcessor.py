from datetime import datetime
import re
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import UpdateOne 

# Connect to MongoDB
uri = "mongodb+srv://lawjiahua97:Blu%2Ab%2Arry123@jhtestmongodatabase.hhxyrnh.mongodb.net/?retryWrites=true&w=majority&appName=jhTestMongoDatabase"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client["beehive"]  # Change to your actual database name
collection = db["measurements"]  # Change to your actual time series collection name

# NOTE: at the start of every line in the infrared files, there is a hidden character which needs to be removed for processing.
def process_file(file_path):
    # Extract date from file name (assuming format "YYYYMMDD-XXXXXXX.txt")
    base_name = os.path.basename(file_path)
    file_date_str = base_name.split('-')[0]

    with open(file_path, 'r') as file:
        lines = file.readlines()[2:]  # Skip header

    readings = {}
 
    for line in lines:
        if not re.sub(r'[^\w\s,.!?-]', '', line).strip():
            continue
        time_str, reading = line.strip().split(', ')
        # Combine file date and time from line to create a full datetime object
        datetime_str = f"{file_date_str}{time_str}"# Split the string into components
        year = file_date_str[0:4]
#        month = file_date_str[4:6] seed as jan 
        month = "01"
        day = file_date_str[6:8]
        hour = time_str[0:3]
        minute = time_str[3:]

        # Combine the components with "/" as separator
        formatted_time_str = year + "/" + month + "/" + day + "/" + hour + "/" + minute
        cleaned_time_str = re.sub(r"[^\d/]", "", formatted_time_str)
        print("__________")
        print(formatted_time_str)
        timestamp = datetime.strptime(cleaned_time_str, "%Y/%m/%d/%H/%M")
        reading = int(reading)

        # Group by 15-minute intervals
        interval_start = timestamp.replace(minute=(timestamp.minute // 15) * 15, second=0, microsecond=0)
        if interval_start not in readings:
            readings[interval_start] = []
        readings[interval_start].append(reading)

    # Prepare records for MongoDB
    # if record exists, we should only modify the infrared reading 
    updates = [] 
    records = []
    for interval_start, values in readings.items():
        avg_reading = sum(values) / len(values)
        min_reading = min(values)
        max_reading = max(values)
        document = collection.find_one({"time": interval_start})
        if document:
            updates.append(UpdateOne({"_id": document["_id"]}, {"$set": {"infraredReading": {"avg": avg_reading, "min" : min_reading, "max" : max_reading}}}))
        else:
            record = {
                "beehive": "beehive1",
                "time": interval_start,  # This field is crucial for time series collections
                "infraredReading": {
                    "avg" : avg_reading,
                    "min" : min_reading,
                    "max" : max_reading 
                }, 
                "weight": None,
                "temperature": None 
            }
            records.append(record)

    return records, updates

def process_folder(folder_path):
    for file_name in os.listdir(folder_path):
        if file_name.endswith(".txt"):
            file_path = os.path.join(folder_path, file_name)
            new_records, updates = process_file(file_path)
            if new_records:
                collection.insert_many(new_records)
            if updates:
                collection.bulk_write(updates)

# Replace 'your_folder_path' with the actual path to your folder containing .txt files
folder_path = 'infraredReadings'
process_folder(folder_path)

