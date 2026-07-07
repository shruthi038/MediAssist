from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime, time
from app.db.models.user import get_utc_now

class Reminder(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    prescription_id: Optional[uuid.UUID] = Field(default=None, foreign_key="prescription.id")
    medicine_id: Optional[uuid.UUID] = Field(default=None, foreign_key="medicine.id")
    medicine_name: Optional[str] = None
    dose_description: Optional[str] = None
    reminder_time: Optional[time] = None
    frequency: Optional[str] = None
    days_of_week: Optional[str] = None
    reminder_type: str = Field(default="auto")
    status: str = Field(default="active")
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    user: "User" = Relationship(back_populates="reminders")
