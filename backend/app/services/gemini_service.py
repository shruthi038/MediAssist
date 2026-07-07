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

    @staticmethod
    def extract_medicines(raw_text: str) -> list:
        """
        Sends the OCR text to Gemini to extract structured medicine records.
        """
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")
            
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = (
            "You are a medical information extraction assistant.\n"
            "Extract every medicine mentioned in the prescription text provided below.\n"
            "Return ONLY valid JSON.\n"
            "Do not explain. Do not include markdown. Do not hallucinate.\n"
            "If dosage, duration, frequency, or instructions are not explicitly present in the text, return null instead of guessing.\n"
            "Include a 'confidence_score' (0.0 to 1.0) for each extracted medicine.\n"
            "Return an array in this exact format:\n"
            "[\n"
            "  {\n"
            "    \"medicine_name\": \"\",\n"
            "    \"dosage\": \"\",\n"
            "    \"frequency\": \"\",\n"
            "    \"duration\": \"\",\n"
            "    \"instructions\": \"\",\n"
            "    \"confidence_score\": 0.0\n"
            "  }\n"
            "]\n\n"
            f"Prescription Text:\n{raw_text}"
        )
        
        # Generation config to ensure JSON response if supported, though prompt instructions are usually sufficient.
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        
        if not response.text:
            raise Exception("Gemini returned an empty response")
            
        import json
        try:
            # Safely parse JSON. 
            text = response.text.strip()
            # Strip markdown block if model ignored the prompt instruction
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            medicines = json.loads(text.strip())
            if not isinstance(medicines, list):
                raise ValueError("Expected a JSON array")
            return medicines
        except Exception as e:
            raise Exception(f"Failed to parse Gemini response as JSON: {str(e)}\nRaw Response: {response.text}")
