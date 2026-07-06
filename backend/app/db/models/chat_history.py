from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
import uuid
from datetime import datetime
from app.db.models.user import get_utc_now

class ChatHistory(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    interaction_type: str
    input_text: Optional[str] = None
    ai_output: str
    severity: Optional[str] = None
    created_at: datetime = Field(default_factory=get_utc_now)

    user: "User" = Relationship(back_populates="chat_histories")
