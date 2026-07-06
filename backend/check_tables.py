import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("NO DATABASE_URL")
    exit(1)

connect_args = {"sslmode": "require"} if "supabase.co" in DATABASE_URL or "pooler.supabase.com" in DATABASE_URL else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

inspector = inspect(engine)
tables = inspector.get_table_names()
expected = ["user", "prescription", "medicine", "reminder", "chathistory", "doctorsummary"]
print("Tables in DB:", tables)
missing = [t for t in expected if t not in tables]
if not missing:
    print("All tables created successfully.")
else:
    print("Missing tables:", missing)
