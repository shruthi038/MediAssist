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
