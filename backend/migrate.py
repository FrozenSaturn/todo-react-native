from sqlalchemy import create_engine, text
from app.core.config import settings
from app.core.database import Base
from app.models import user, todo, folder, subtask

def migrate():
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    with engine.connect() as connection:
        connection.execution_options(isolation_level="AUTOCOMMIT")
        try:
            # Check if column exists to avoid error
            result = connection.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='todos' AND column_name='folder_id'"))
            if result.fetchone():
                print("Column folder_id already exists in todos table.")
            else:
                print("Adding folder_id column to todos table...")
                connection.execute(text("ALTER TABLE todos ADD COLUMN folder_id INTEGER REFERENCES folders(id)"))
                print("Migration successful.")
        except Exception as e:
            print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
