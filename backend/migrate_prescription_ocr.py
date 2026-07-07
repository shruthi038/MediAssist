from sqlmodel import Session, text
from app.db.database import engine

def migrate():
    with Session(engine) as session:
        # Add raw_text column
        session.exec(text("ALTER TABLE prescription ADD COLUMN IF NOT EXISTS raw_text TEXT;"))
        session.commit()
        print("Migration completed: added raw_text.")

if __name__ == "__main__":
    migrate()
