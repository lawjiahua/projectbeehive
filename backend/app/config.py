import os
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

load_dotenv()  # Load variables from .env file

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    DATABASE_URL = os.getenv('DATABASE_URL')
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
    GOOGLE_SERVICE_ACCOUNT_FILE = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')
    GOOGLE_DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive']

    @staticmethod
    def create_drive_client():
        creds = service_account.Credentials.from_service_account_file(
            Config.GOOGLE_SERVICE_ACCOUNT_FILE, scopes=Config.GOOGLE_DRIVE_SCOPES)
        return build('drive', 'v3', credentials=creds)