import uuid
from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

class StorageService:
    @staticmethod
    def upload_prescription(file_bytes: bytes, extension: str, user_id: str) -> str:
        """
        Uploads a prescription file to Supabase storage.
        Returns the internal file path.
        """
        file_uuid = str(uuid.uuid4())
        # Ensure extension has no leading dot
        ext = extension.lstrip('.')
        file_path = f"prescriptions/{user_id}/{file_uuid}.{ext}"
        
        # Upload the file bytes
        # We assume the bucket is public or authenticated access is configured.
        # file_options: contentType might be needed depending on the extension
        content_type = f"image/{ext}" if ext in ['jpg', 'jpeg', 'png'] else "application/pdf"
        
        res = supabase.storage.from_(settings.STORAGE_BUCKET).upload(
            file_path, 
            file_bytes, 
            file_options={"content-type": content_type}
        )
        
        # If upload fails, Supabase Python client raises an exception (StorageException)
        
        return file_path
        
    @staticmethod
    def download_prescription(file_path: str) -> bytes:
        """
        Downloads a prescription file from Supabase storage.
        Returns the file bytes.
        """
        res = supabase.storage.from_(settings.STORAGE_BUCKET).download(file_path)
        return res

    @staticmethod
    def delete_prescription(file_path: str) -> bool:
        """
        Deletes a prescription file from Supabase storage.
        """
        try:
            res = supabase.storage.from_(settings.STORAGE_BUCKET).remove([file_path])
            return True if res else False
        except Exception:
            return False

    @staticmethod
    def create_signed_url(file_path: str, expires_in: int = 3600) -> str:
        """
        Generates a signed URL to securely download/view the file.
        """
        try:
            res = supabase.storage.from_(settings.STORAGE_BUCKET).create_signed_url(file_path, expires_in)
            return res.get('signedURL', '')
        except Exception:
            return ""

    @staticmethod
    def upload_document(file_bytes: bytes, extension: str, user_id: str, content_type: str = None) -> str:
        """
        Uploads a generic medical document to Supabase storage.
        Returns the internal file path.
        """
        file_uuid = str(uuid.uuid4())
        ext = extension.lstrip('.')
        file_path = f"documents/{user_id}/{file_uuid}.{ext}"
        
        if not content_type:
            content_type = f"image/{ext}" if ext in ['jpg', 'jpeg', 'png'] else "application/pdf"
            
        res = supabase.storage.from_(settings.STORAGE_BUCKET).upload(
            file_path, 
            file_bytes, 
            file_options={"content-type": content_type}
        )
        return file_path

    @staticmethod
    def delete_document(file_path: str) -> bool:
        """
        Deletes a medical document from Supabase storage.
        """
        try:
            res = supabase.storage.from_(settings.STORAGE_BUCKET).remove([file_path])
            return True if res else False
        except Exception:
            return False

    @staticmethod
    def create_document_signed_url(file_path: str, expires_in: int = 3600) -> str:
        """
        Generates a signed URL for a general medical document.
        """
        return StorageService.create_signed_url(file_path, expires_in)
