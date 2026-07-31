import os
import sys

# Add backend dir to python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from sqlmodel import SQLModel
from app.db.database import engine
# Import all models to ensure they are registered with SQLModel
from app.db.models import *
from app.core.logger import logger

def migrate():
    logger.info("Creating MedicalDocument table if it doesn't exist...")
    # This safely creates new tables without dropping existing ones
    SQLModel.metadata.create_all(engine)
    logger.info("Migration successful.")

if __name__ == "__main__":
    migrate()
