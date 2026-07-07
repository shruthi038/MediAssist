import google.generativeai as genai
from app.core.config import settings

# Configure Gemini API
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

class GeminiService:
    @staticmethod
    def extract_prescription_text(file_bytes: bytes, extension: str) -> str:
        """
        Sends the prescription to Gemini Vision and extracts all readable text.
        Does not interpret, summarize, or format the text.
        """
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")

        # Determine MIME type
        ext = extension.lower().strip('.')
        if ext in ['jpg', 'jpeg']:
            mime_type = "image/jpeg"
        elif ext == 'png':
            mime_type = "image/png"
        elif ext == 'pdf':
            mime_type = "application/pdf"
        else:
            raise ValueError(f"Unsupported extension for OCR: {extension}")
            
        # Select the appropriate model (gemini-2.5-flash works well for documents/images)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = (
            "Extract every piece of readable text from this prescription exactly as written. "
            "Do not summarize. Do not interpret medicines. Do not guess missing words. "
            "Return only the extracted text."
        )
        
        # Pass file bytes directly inline
        contents = [
            {"mime_type": mime_type, "data": file_bytes},
            prompt
        ]
        
        response = model.generate_content(contents)
        
        if not response.text:
            raise Exception("Gemini returned an empty response")
            
        return response.text
