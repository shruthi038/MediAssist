from sqlmodel import Session, text
from app.db.database import engine

def migrate():
    with Session(engine) as session:
        # Add original_filename
        session.exec(text("ALTER TABLE prescription ADD COLUMN IF NOT EXISTS original_filename VARCHAR;"))
        
        # Rename image_url to file_path
        try:
            session.exec(text("ALTER TABLE prescription RENAME COLUMN image_url TO file_path;"))
        except Exception as e:
            print("image_url might already be renamed:", e)
            
        # Rename status to processing_status
        try:
            session.exec(text("ALTER TABLE prescription RENAME COLUMN status TO processing_status;"))
        except Exception as e:
            print("status might already be renamed:", e)
            
        # Rename created_at to uploaded_at
        try:
            session.exec(text("ALTER TABLE prescription RENAME COLUMN created_at TO uploaded_at;"))
        except Exception as e:
            print("created_at might already be renamed:", e)
            
        session.commit()
        print("Migration completed.")

if __name__ == "__main__":
    migrate()
