from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime
from app.db.models.user import get_utc_now

class DoctorSummary(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    prescription_id: uuid.UUID = Field(foreign_key="prescription.id", unique=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    summary_text: str
    created_at: datetime = Field(default_factory=get_utc_now)
    generated_at: datetime = Field(default_factory=get_utc_now)

    prescription: "Prescription" = Relationship(back_populates="doctor_summary")
