import uuid
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship
from typing import Optional
from enum import Enum

def get_utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class DocumentType(str, Enum):
    PRESCRIPTION = "Prescription"
    BLOOD_REPORT = "Blood Report"
    LAB_REPORT = "Lab Report"
    MRI = "MRI"
    CT_SCAN = "CT Scan"
    X_RAY = "X-Ray"
    ECG = "ECG"
    DISCHARGE_SUMMARY = "Discharge Summary"
    MEDICAL_CERTIFICATE = "Medical Certificate"
    VACCINATION_RECORD = "Vaccination Record"
    INSURANCE_DOCUMENT = "Insurance Document"
    OTHER = "Other"

class MedicalDocument(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id")
    original_filename: str
    file_path: str
    document_type: str  # Validated using DocumentType enum during API call
    mime_type: str
    file_size: int
    title: Optional[str] = None
    description: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=get_utc_now)
    created_at: datetime = Field(default_factory=get_utc_now)
    updated_at: datetime = Field(default_factory=get_utc_now)

    user: "User" = Relationship(back_populates="medical_documents")
