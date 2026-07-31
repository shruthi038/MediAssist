from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

from app.db.database import get_session
from app.api.deps import get_current_user
from app.db.models.user import User
from app.db.models.chat_history import ChatHistory
from app.db.models.prescription import Prescription
from app.db.models.medicine import Medicine
from app.db.models.reminder import Reminder
from app.services.assistant_service import AssistantService
from app.core.logger import logger

router = APIRouter(prefix="/assistant", tags=["assistant"])

class ChatRequest(BaseModel):
    message: str
    session_id: str
    is_voice: bool = False

class ChatResponse(BaseModel):
    id: str
    response: str
    agent_used: str
    created_at: datetime

class ChatHistoryResponse(BaseModel):
    id: str
    session_id: str
    message: str
    response: str
    agent_used: str
    is_voice: bool
    created_at: datetime

@router.post("/chat", response_model=ChatResponse)
async def process_chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    if not request.session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    try:
        # 1. Fetch user's completed prescriptions and their medicines for context
        prescriptions = session.exec(
            select(Prescription).where(
                Prescription.user_id == current_user.id,
                Prescription.processing_status == "completed"
            )
        ).all()

        context_data = []
        for p in prescriptions:
            medicines = session.exec(select(Medicine).where(Medicine.prescription_id == p.id)).all()
            reminders = session.exec(select(Reminder).where(Reminder.prescription_id == p.id)).all()
            context_data.append({
                "date": p.uploaded_at.isoformat(),
                "medicines": medicines,
                "reminders": reminders
            })

        # 2. Retrieve past memory for this session
        # Interaction type is stored as: f"{session_id}|{agent_used}"
        past_chats = session.exec(
            select(ChatHistory)
            .where(
                ChatHistory.user_id == current_user.id,
                ChatHistory.interaction_type.startswith(f"{request.session_id}|")
            )
            .order_by(ChatHistory.created_at.asc())
            .limit(20)
        ).all()

        # 3. Call AssistantService (Multi-Agent Dispatcher)
        result = AssistantService.process_chat(
            message=request.message,
            is_voice=request.is_voice,
            prescriptions_context=context_data,
            past_chats=past_chats
        )

        ai_response = result["response"]
        agent_used = result["agent_used"]

        # 4. Save to ChatHistory
        # Interaction type encodes the session_id and the agent used
        agent_with_voice = f"{agent_used}_VOICE" if request.is_voice else agent_used
        interaction_type = f"{request.session_id}|{agent_with_voice}"

        new_history = ChatHistory(
            user_id=current_user.id,
            interaction_type=interaction_type,
            input_text=request.message,
            ai_output=ai_response
        )
        
        session.add(new_history)
        session.commit()
        session.refresh(new_history)

        return ChatResponse(
            id=str(new_history.id),
            response=ai_response,
            agent_used=agent_used,
            created_at=new_history.created_at
        )

    except Exception as e:
        logger.error(f"Error in assistant chat: {str(e)}")
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=List[ChatHistoryResponse])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    history = session.exec(
        select(ChatHistory)
        .where(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(200) # Fetch more to allow grouping in frontend
    ).all()

    results = []
    for h in history:
        # Default if it's an old record without a session ID
        session_id = "default-session"
        agent_str = h.interaction_type
        
        if "|" in h.interaction_type:
            parts = h.interaction_type.split("|", 1)
            session_id = parts[0]
            agent_str = parts[1]
            
        is_voice = "_VOICE" in agent_str
        agent_used = agent_str.replace("_VOICE", "")

        results.append(ChatHistoryResponse(
            id=str(h.id),
            session_id=session_id,
            message=h.input_text or "",
            response=h.ai_output,
            agent_used=agent_used,
            is_voice=is_voice,
            created_at=h.created_at
        ))

    return results
