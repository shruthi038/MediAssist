import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from app.core.config import settings
from app.core.logger import logger

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
        
        try:
            response = model.generate_content(contents)
            
            if not response.text:
                logger.error("Gemini OCR returned an empty response")
                raise ValueError("Gemini returned an empty response")
                
            logger.info("OCR extraction completed successfully")
            return response.text
        except google_exceptions.ResourceExhausted:
            logger.error("Gemini API rate limit exceeded during OCR")
            raise Exception("Gemini API rate limit exceeded. Please retry after a few seconds.")
        except google_exceptions.GoogleAPICallError as e:
            logger.error(f"Gemini API error during OCR: {str(e)}")
            raise Exception(f"Gemini API error: {str(e)}")

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
        
        # Generation config to ensure JSON response if supported
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(response_mime_type="application/json")
            )
            
            if not response.text:
                logger.error("Gemini returned an empty response during medicine extraction")
                raise ValueError("Gemini returned an empty response")
                
            import json
            # Safely parse JSON. 
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
                
            medicines = json.loads(text.strip())
            if not isinstance(medicines, list):
                raise ValueError("Expected a JSON array")
                
            logger.info(f"Successfully extracted {len(medicines)} medicines")
            return medicines
            
        except google_exceptions.ResourceExhausted:
            logger.error("Gemini API rate limit exceeded during medicine extraction")
            raise Exception("Gemini API rate limit exceeded. Please retry after a few seconds.")
        except google_exceptions.GoogleAPICallError as e:
            logger.error(f"Gemini API error during medicine extraction: {str(e)}")
            raise Exception(f"Gemini API error: {str(e)}")
        except Exception as e:
            logger.error(f"Failed to parse Gemini JSON response: {str(e)}")
            raise Exception(f"Failed to parse Gemini response as JSON: {str(e)}")

    @staticmethod
    def generate_doctor_summary(raw_text: str, medicines: list) -> str:
        """
        Generates a plain-text patient-friendly explanation of the prescription.
        """
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")
            
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Prepare medicines list as string context
        medicines_str = ""
        for med in medicines:
            medicines_str += f"- Medicine: {med.name}, Dosage: {med.dosage}, Frequency: {med.frequency}, Duration: {med.duration}, Instructions: {med.special_instructions}\n"
            
        prompt = (
            "You are a helpful, professional, and compassionate medical AI assistant explaining a prescription to a patient.\n"
            "Based on the OCR text and extracted medicines below, generate a clear, patient-friendly summary.\n\n"
            "STRICT FORMATTING RULES:\n"
            "1. Output clean Markdown formatting with headings and bullet points.\n"
            "2. Use the exact structure below.\n\n"
            "REQUIRED STRUCTURE:\n"
            "# Prescription Summary\n"
            "[Brief explanation of the prescription]\n\n"
            "## Medicines\n"
            "- [Medicine Name]\n"
            "  - Purpose: [Purpose]\n"
            "  - Dosage: [Dosage]\n"
            "  - Frequency: [Frequency]\n\n"
            "## How to Take Your Medicines\n"
            "[Simple patient-friendly explanation]\n\n"
            "## Important Advice\n"
            "- [Bullet points]\n\n"
            "## When to Contact a Doctor\n"
            "- [Bullet points]\n\n"
            "## Disclaimer\n"
            "[Clearly mention this is AI-generated and not a substitute for professional medical advice]\n\n"
            "STRICT SAFETY RULES:\n"
            "- NEVER diagnose diseases.\n"
            "- NEVER guess missing information.\n"
            "- NEVER invent medicine purposes if you are uncertain. If you don't confidently know what a medicine is for, say so.\n"
            "- NEVER replace professional medical advice.\n"
            "- Clearly state uncertainty whenever appropriate.\n"
            "- Your tone must be reassuring but completely clear about these limitations.\n\n"
            f"--- OCR TEXT ---\n{raw_text}\n\n"
            f"--- EXTRACTED MEDICINES ---\n{medicines_str}"
        )
        
        try:
            response = model.generate_content(prompt)
            
            if not response.text:
                logger.error("Gemini returned an empty response during summary generation")
                raise ValueError("Gemini returned an empty response")
                
            logger.info("Successfully generated doctor summary")
            return response.text.strip()
            
        except google_exceptions.ResourceExhausted:
            logger.error("Gemini API rate limit exceeded during summary generation")
            raise Exception("Gemini API rate limit exceeded. Please retry after a few seconds.")
        except google_exceptions.GoogleAPICallError as e:
            logger.error(f"Gemini API error during summary generation: {str(e)}")
            raise Exception(f"Gemini API error: {str(e)}")
