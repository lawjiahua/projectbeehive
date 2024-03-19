from datetime import datetime
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
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

# Set up the credentials for sheets
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SERVICE_ACCOUNT_FILE = 'BeehiveProject data.json'

credentials = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# Initialize the Sheets API client
service = build('sheets', 'v4', credentials=credentials)

# Specify the spreadsheet and range you want to access
SPREADSHEET_ID = '1YosxsdrXrBfvl7aKzF6uLhgVEwpSjWfJDlY-ZZaorJU'
RANGE_NAME = 'Sep2023!B:J'  # Adjust the range accordingly

# Make the API call
sheet = service.spreadsheets()
result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                            range=RANGE_NAME).execute()
values = result.get('values', [])

updates = []
new_records = []
# Process and save temperature and weight 
for row in values[1:]:
    timeString = row[0]
    datetimeObject = datetime.strptime(timeString, "%Y-%b-%d %H:%M:%S") 
    print("weight is " + row[8])
    print("temperature is " + row[2])

    #process time to nearest 15 min interval
    datetimeObject = datetimeObject.replace(year=2024, month=1, minute = (datetimeObject.minute // 15) * 15, second = 0, microsecond = 0)
    if(datetimeObject.day <= 10):
        print("processing data for: " + datetimeObject.strftime("%Y-%m-%d %H:%M"))
        document = collection.find_one({"time": datetimeObject})
        if document:
            updates.append(UpdateOne({"_id": document["_id"]}, {"$set": {'weight': row[8], 'temperature': row[2]}}))
            print("updating this document!")
        else:
            record = {
                "beehive": "beehive1",
                "time": datetimeObject,  # This field is crucial for time series collections
                "infraredReading": None, 
                "weight": row[8],
                "temperature": row[2] 
            }
            new_records.append(record)
            print("creating a new document")
        print("------------------------------------------------")

# perform calls to database 
if new_records:
    collection.insert_many(new_records)
if updates:
    collection.bulk_write(updates)

print("ending of processing")
