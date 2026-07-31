from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

from app.db.database import get_session
from app.api.deps import get_current_user
from app.db.models.user import User
from app.db.models.medical_document import MedicalDocument, DocumentType
from app.services.storage_service import StorageService
from app.core.logger import logger

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE_MB = 10
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

class DocumentResponseModel(BaseModel):
    document_id: str
    original_filename: str
    document_type: str
    file_size: int
    title: Optional[str] = None
    description: Optional[str] = None
    uploaded_at: datetime

class DocumentUploadResponse(BaseModel):
    message: str
    document: DocumentResponseModel

@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    document_type: DocumentType = Form(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
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
    file_size = len(file_bytes)
    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"File too large. Maximum size is {MAX_FILE_SIZE_MB} MB"
        )
        
    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Empty file uploaded"
        )

    # Content Type Inference
    content_type = file.content_type
    if not content_type:
        content_type = f"image/{ext.lstrip('.')}" if ext.lstrip('.') in ['jpg', 'jpeg', 'png'] else "application/pdf"

    # Upload to Supabase Storage
    try:
        file_path = StorageService.upload_document(file_bytes, ext, str(current_user.id), content_type=content_type)
    except Exception as e:
        logger.error(f"Failed to upload document to storage: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload file to storage."
        )
        
    # Create database record
    try:
        new_document = MedicalDocument(
            user_id=current_user.id,
            original_filename=file.filename,
            file_path=file_path,
            document_type=document_type.value,
            mime_type=content_type,
            file_size=file_size,
            title=title,
            description=description
        )
        session.add(new_document)
        session.commit()
        session.refresh(new_document)
    except Exception as e:
        session.rollback()
        # Rollback storage if DB fails
        StorageService.delete_document(file_path)
        logger.error(f"Failed to save document to database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save document to database."
        )
        
    return DocumentUploadResponse(
        message="Document uploaded successfully",
        document=DocumentResponseModel(
            document_id=str(new_document.id),
            original_filename=new_document.original_filename,
            document_type=new_document.document_type,
            file_size=new_document.file_size,
            title=new_document.title,
            description=new_document.description,
            uploaded_at=new_document.uploaded_at
        )
    )

@router.get("", response_model=List[DocumentResponseModel])
async def get_documents(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Returns all medical documents belonging to the authenticated user, newest first.
    """
    documents = session.exec(
        select(MedicalDocument)
        .where(MedicalDocument.user_id == current_user.id)
        .order_by(MedicalDocument.uploaded_at.desc())
    ).all()
    
    return [
        DocumentResponseModel(
            document_id=str(d.id),
            original_filename=d.original_filename,
            document_type=d.document_type,
            file_size=d.file_size,
            title=d.title,
            description=d.description,
            uploaded_at=d.uploaded_at
        ) for d in documents
    ]

class DocumentDetailResponseModel(BaseModel):
    document: DocumentResponseModel
    download_url: str
    expires_in: int

@router.get("/{document_id}", response_model=DocumentDetailResponseModel)
async def get_document_details(
    document_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Returns document metadata and a secure signed URL for viewing/downloading.
    """
    document = session.get(MedicalDocument, document_id)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        
    if str(document.user_id) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this document")
    
    expires_in = 3600
    signed_url = StorageService.create_document_signed_url(document.file_path, expires_in=expires_in)
    
    if not signed_url:
        raise HTTPException(status_code=500, detail="Failed to generate signed URL for the document.")
        
    return DocumentDetailResponseModel(
        document=DocumentResponseModel(
            document_id=str(document.id),
            original_filename=document.original_filename,
            document_type=document.document_type,
            file_size=document.file_size,
            title=document.title,
            description=document.description,
            uploaded_at=document.uploaded_at
        ),
        download_url=signed_url,
        expires_in=expires_in
    )

class DeleteResponseModel(BaseModel):
    message: str

@router.delete("/{document_id}", response_model=DeleteResponseModel)
async def delete_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Safely deletes a medical document from storage and the database.
    """
    document = session.get(MedicalDocument, document_id)
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        
    if str(document.user_id) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this document")
    
    try:
        # Delete from Supabase Storage
        StorageService.delete_document(document.file_path)
        
        # Delete from Database
        session.delete(document)
        session.commit()
        
        logger.info(f"Document {document_id} deleted successfully.")
        return DeleteResponseModel(message="Document deleted successfully")
    except Exception as e:
        session.rollback()
        logger.error(f"Failed to delete document {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the document.")
