import uuid
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List

def get_utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class User(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    password_hash: str
    age: Optional[int] = None
    gender: Optional[str] = None
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    prescriptions: List["Prescription"] = Relationship(back_populates="user")
    reminders: List["Reminder"] = Relationship(back_populates="user")
    chat_histories: List["ChatHistory"] = Relationship(back_populates="user")
