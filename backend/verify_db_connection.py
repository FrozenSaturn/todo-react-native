from sqlalchemy import create_engine
from app.core.config import settings
import sys

try:
    print(f"Connecting to {settings.DATABASE_URL}...")
    engine = create_engine(settings.DATABASE_URL)
    connection = engine.connect()
    print("Successfully connected to the database!")
    connection.close()
    sys.exit(0)
except Exception as e:
    print(f"Failed to connect: {e}")
    sys.exit(1)
