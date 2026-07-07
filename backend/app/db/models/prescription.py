from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime
from app.db.models.user import get_utc_now

class Prescription(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    original_filename: Optional[str] = None
    file_path: str
    raw_text: Optional[str] = None
    processing_status: str = Field(default="uploaded")
    is_confirmed: bool = Field(default=False)
    uploaded_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    user: "User" = Relationship(back_populates="prescriptions")
    medicines: List["Medicine"] = Relationship(back_populates="prescription")
    doctor_summary: Optional["DoctorSummary"] = Relationship(back_populates="prescription")
