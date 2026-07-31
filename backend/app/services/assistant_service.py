import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from app.core.config import settings
from app.core.logger import logger

class AssistantService:
    @staticmethod
    def _determine_agent(message: str) -> str:
        """
        Uses local keyword matching to classify the user's intent and select the appropriate agent,
        avoiding a redundant LLM API call.
        """
        msg_lower = message.lower()
        
        # 1. Symptom Triage Keywords
        symptom_keywords = ['pain', 'fever', 'cough', 'hurt', 'ache', 'swollen', 'vomit', 'nausea', 'dizzy', 'symptom', 'feel cold', 'runny nose', 'throat', 'headache', 'sick']
        if any(keyword in msg_lower for keyword in symptom_keywords):
            return "SYMPTOM_TRIAGE"

        # 2. Prescription Context Keywords
        prescription_keywords = ['my prescription', 'my medicine', 'active prescription', 'my med', 'what am i taking', 'schedule', 'when should i take', 'reminders']
        if any(keyword in msg_lower for keyword in prescription_keywords):
            return "PRESCRIPTION_CONTEXT"

        # 3. Medicine Explanation Keywords
        medicine_keywords = ['side effect', 'what is ', 'interact', 'is it safe', 'precautions']
        if any(keyword in msg_lower for keyword in medicine_keywords):
            return "MEDICINE_EXPLANATION"

        # 4. Fallback to General Health
        return "GENERAL_HEALTH"

    @staticmethod
    def _get_agent_prompt(agent_type: str, is_voice: bool, context_str: str) -> str:
        base_rules = (
            "CRITICAL RULES FOR ALL RESPONSES:\n"
            "1. NO MARKDOWN. Do not use **bold**, *italics*, or markdown headers. Respond in plain text.\n"
            "2. CONVERSATIONAL TONE. Speak like a friendly, human healthcare assistant.\n"
            "3. KEEP IT SHORT. Default to 3-6 short sentences maximum. Only provide longer answers if the user explicitly asks for details or full information.\n"
            "4. NO BULLET OVERLOAD. Avoid using long bulleted lists unless explicitly asked. Use natural sentences.\n"
        )
        
        voice_constraint = (
            "\nVOICE MODE ACTIVE: The user is speaking. Make your response even shorter (1-3 sentences) and highly conversational."
        ) if is_voice else ""

        if agent_type == "PRESCRIPTION_CONTEXT":
            return f"""
            You are a helpful AI Health Assistant (Prescription Agent).
            
            USER CONTEXT:
            {context_str}
            
            RULES FOR PRESCRIPTIONS:
            - If asked 'What are my medicines?', do NOT list every single detail. Instead, say something natural like 'You currently have X medicines in your prescription...' and briefly list the names and primary purpose.
            - Only explain a specific medicine in detail if they ask 'What is [Medicine]?'
            
            {base_rules}
            {voice_constraint}
            """
            
        elif agent_type == "MEDICINE_EXPLANATION":
            return f"""
            You are a helpful AI Health Assistant (Medicine Agent).
            
            RULES FOR MEDICINE EXPLANATION:
            - Explain the medicine asked about. 
            - Briefly mention what it's for, common side effects, and best time to take it.
            - Keep it under 100 words.
            - Tell the user to consult their doctor before changing medications.
            
            {base_rules}
            {voice_constraint}
            """
            
        elif agent_type == "SYMPTOM_TRIAGE":
            return f"""
            You are a helpful AI Health Assistant (Symptom Agent).
            
            RULES FOR SYMPTOMS:
            - NEVER present results as a confirmed diagnosis.
            - Explain possible conditions gently.
            - Suggest safe self-care (e.g. 'drink warm fluids').
            - Emphasize warning signs that require immediate attention.
            - If needed, recommend an appropriate specialist.
            
            {base_rules}
            {voice_constraint}
            """
            
        else: # GENERAL_HEALTH
            return f"""
            You are a helpful AI Health Assistant.
            
            RULES FOR GENERAL HEALTH:
            - Answer general wellness and lifestyle questions naturally.
            - Do not diagnose.
            
            {base_rules}
            {voice_constraint}
            """

    @staticmethod
    def process_chat(message: str, is_voice: bool, prescriptions_context: list, past_chats: list = None) -> dict:
        """
        Orchestrates the multi-agent architecture with conversation memory.
        """
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")

        # 1. Dispatcher: Determine the appropriate agent
        agent_type = AssistantService._determine_agent(message)
        logger.info(f"Dispatcher selected agent: {agent_type}")

        # 2. Build Context String
        context_str = "No active prescriptions found."
        total_meds = 0
        if prescriptions_context and len(prescriptions_context) > 0:
            context_str = ""
            for p in prescriptions_context:
                if p.get('medicines'):
                    for m in p['medicines']:
                        total_meds += 1
                        context_str += f"- {m.name} (Dose: {m.dosage})\n"
            
            if total_meds > 0:
                context_str = f"The user has {total_meds} active medicines:\n" + context_str
            else:
                context_str = "No active medicines found in prescriptions."

        # 3. Get System Prompt
        system_prompt = AssistantService._get_agent_prompt(agent_type, is_voice, context_str)

        # 4. Reconstruct Gemini History
        gemini_history = []
        if past_chats:
            for chat in past_chats:
                if chat.input_text:
                    gemini_history.append({"role": "user", "parts": [chat.input_text]})
                if chat.ai_output:
                    gemini_history.append({"role": "model", "parts": [chat.ai_output]})

        # 5. Invoke Agent with Memory
        model = genai.GenerativeModel("gemini-2.5-flash", system_instruction=system_prompt)
        chat_session = model.start_chat(history=gemini_history)
        
        try:
            response = chat_session.send_message(message)
            
            if not response.text:
                raise ValueError("Gemini returned an empty response")
                
            return {
                "response": response.text.strip(),
                "agent_used": agent_type
            }
            
        except Exception as e:
            logger.error(f"Agent processing failed: {str(e)}")
            raise Exception(f"AI Assistant failed: {str(e)}")
