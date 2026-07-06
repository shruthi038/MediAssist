from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime, time
from app.db.models.user import get_utc_now

class Reminder(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    medicine_name: str
    dose_description: Optional[str] = None
    reminder_time: time
    frequency: str
    days_of_week: Optional[str] = None
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    user: "User" = Relationship(back_populates="reminders")
