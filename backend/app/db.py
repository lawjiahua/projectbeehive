from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

client = MongoClient(os.getenv('DATABASE_URL'), server_api=ServerApi('1'))

def get_db(collection_name):
    db = client['beehive']
    return db[collection_name]
