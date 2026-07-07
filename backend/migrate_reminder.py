from sqlmodel import Session, text
from app.db.database import engine

def migrate():
    with Session(engine) as session:
        session.exec(text("ALTER TABLE reminder ADD COLUMN IF NOT EXISTS prescription_id UUID REFERENCES prescription(id);"))
        session.exec(text("ALTER TABLE reminder ADD COLUMN IF NOT EXISTS medicine_id UUID REFERENCES medicine(id);"))
        session.exec(text("ALTER TABLE reminder ADD COLUMN IF NOT EXISTS reminder_type VARCHAR DEFAULT 'auto';"))
        session.exec(text("ALTER TABLE reminder ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'active';"))
        session.exec(text("ALTER TABLE reminder ALTER COLUMN reminder_time DROP NOT NULL;"))
        session.exec(text("ALTER TABLE reminder ALTER COLUMN medicine_name DROP NOT NULL;"))
        session.exec(text("ALTER TABLE reminder ALTER COLUMN frequency DROP NOT NULL;"))
        session.commit()
        print("Reminder migration completed.")

if __name__ == "__main__":
    migrate()
