from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "hrms_lite")

client = None
database = None

async def connect_to_mongo():
    global client, database
    try:
        import certifi
        client = AsyncIOMotorClient(
            MONGODB_URL,
            tls=True,
            tlsCAFile=certifi.where()
        )
        database = client[DATABASE_NAME]
    except ImportError:
        print("Warning: certifi not found, using default SSL settings")
        client = AsyncIOMotorClient(MONGODB_URL, tls=True)
        database = client[DATABASE_NAME]
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        print("Trying with relaxed SSL settings for development...")
        client = AsyncIOMotorClient(
            MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        database = client[DATABASE_NAME]
    
    await database.employees.create_indexes([
        IndexModel([("employee_id", ASCENDING)], unique=True)
    ])
    print("Connected to MongoDB")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")

def get_database():
    return database
