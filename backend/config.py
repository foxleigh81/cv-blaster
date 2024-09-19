import os
from dotenv import load_dotenv

# Get the base directory of the project
basedir = os.path.abspath(os.path.dirname(__file__))

# Load environment variables from the .env file
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Get database URL from environment variable or use default
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/postgres')
    # Get secret key from environment variable or use default
    NEXTAUTH_SECRET = os.environ.get('NEXTAUTH_SECRET', 'test-secret-key')
    # Get testing flag from environment variable or use default
    TESTING = os.environ.get('TESTING', 'True') == 'True' 
    SQLALCHEMY_TRACK_MODIFICATIONS = False