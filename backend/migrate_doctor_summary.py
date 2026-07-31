from sqlmodel import Session, text
from app.db.database import engine

def migrate():
    with Session(engine) as session:
        # User is a reserved keyword in Postgres, so we quote it if needed, or reference it via its SQLModel table name which might be lowercase "user"
        session.exec(text('ALTER TABLE doctorsummary ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES "user"(id);'))
        session.exec(text("ALTER TABLE doctorsummary ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;"))
        session.commit()
        print("DoctorSummary migration completed.")

if __name__ == "__main__":
    migrate()
