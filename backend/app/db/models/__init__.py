from app.db.models.user import User
from app.db.models.prescription import Prescription
from app.db.models.medicine import Medicine
from app.db.models.reminder import Reminder
from app.db.models.chat_history import ChatHistory
from app.db.models.doctor_summary import DoctorSummary
from app.db.models.medical_document import MedicalDocument, DocumentType

# This file ensures all models are imported and registered in the SQLModel metadata.

__all__ = [
    "User",
    "Prescription",
    "Medicine",
    "Reminder",
    "DoctorSummary",
    "ChatHistory",
    "MedicalDocument",
    "DocumentType"
]
