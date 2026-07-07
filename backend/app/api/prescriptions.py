from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlmodel import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid
import os

from app.db.database import get_session
from app.api.deps import get_current_user
from app.db.models.user import User
from app.db.models.prescription import Prescription
from app.services.storage_service import StorageService
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/prescriptions", tags=["prescriptions"])

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

class PrescriptionUploadResponse(BaseModel):
    message: str
    prescription_id: str
    filename: str
    status: str
    uploaded_at: datetime

@router.post("/upload", response_model=PrescriptionUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_prescription(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file uploaded")

    # Extract extension
    _, ext = os.path.splitext(file.filename)
    ext = ext.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
        
    # Read file and check size
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB} MB"
        )
        
    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Empty file uploaded"
        )

    # Upload to Supabase Storage
    try:
        file_path = StorageService.upload_prescription(file_bytes, ext, str(current_user.id))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload file to storage: {str(e)}"
        )
        
    # Create database record
    try:
        new_prescription = Prescription(
            user_id=current_user.id,
            original_filename=file.filename,
            file_path=file_path,
            processing_status="uploaded"
        )
        session.add(new_prescription)
        session.commit()
        session.refresh(new_prescription)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save prescription to database: {str(e)}"
        )
        
    return PrescriptionUploadResponse(
        message="Prescription uploaded successfully",
        prescription_id=str(new_prescription.id),
        filename=new_prescription.original_filename or "",
        status=new_prescription.processing_status,
        uploaded_at=new_prescription.uploaded_at
    )

class OCRResponse(BaseModel):
    message: str
    prescription_id: str
    status: str
    text_preview: str

@router.post("/{prescription_id}/ocr", response_model=OCRResponse)
async def perform_ocr(
    prescription_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Fetch prescription
    prescription = session.get(Prescription, prescription_id)
    if not prescription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prescription not found")
        
    if str(prescription.user_id) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this prescription")
        
    # Idempotent check
    if prescription.processing_status == "ocr_completed":
        return OCRResponse(
            message="OCR already completed",
            prescription_id=str(prescription.id),
            status=prescription.processing_status,
            text_preview=prescription.raw_text[:300] if prescription.raw_text else ""
        )
        
    # Update status to processing
    try:
        prescription.processing_status = "ocr_processing"
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Database update failed")
        
    try:
        # Download file
        file_bytes = StorageService.download_prescription(prescription.file_path)
        
        # Extract extension from file_path
        _, ext = os.path.splitext(prescription.file_path)
        if not ext:
            ext = os.path.splitext(prescription.original_filename or "")[1]
            
        # Call Gemini Service
        raw_text = GeminiService.extract_prescription_text(file_bytes, ext)
        
        # Save results
        prescription.raw_text = raw_text
        prescription.processing_status = "ocr_completed"
        session.commit()
        session.refresh(prescription)
        
        return OCRResponse(
            message="OCR completed successfully",
            prescription_id=str(prescription.id),
            status=prescription.processing_status,
            text_preview=raw_text[:300]
        )
    except Exception as e:
        prescription.processing_status = "ocr_failed"
        session.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR processing failed: {str(e)}"
        )
