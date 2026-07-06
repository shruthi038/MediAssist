import os
from sqlmodel import create_engine, Session
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables.")

# Supabase requires sslmode=require for secure connections
connect_args = {"sslmode": "require"} if "supabase.co" in DATABASE_URL or "pooler.supabase.com" in DATABASE_URL else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True  # Checks if the connection is alive before using it
)

def get_session():
    with Session(engine) as session:
        yield session
