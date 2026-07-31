from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, text, SQLModel
import uvicorn

from app.db.database import engine, get_session
from app.db.models import *
from app.api.auth import router as auth_router
from app.api.prescriptions import router as prescriptions_router
from app.api.documents import router as documents_router
from app.api.assistant import router as assistant_router
from app.core.config import settings
from app.db.database import engine
from supabase import create_client

# We want to test basic connectivity
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(
    title="MediAssist Backend",
    description="Multi-Agent Personal Healthcare Assistant",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(auth_router)
app.include_router(prescriptions_router)
app.include_router(documents_router)
app.include_router(assistant_router)

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to MediAssist API"}

@app.get("/health")
def health_check():
    health = {
        "status": "healthy",
        "database": "disconnected",
        "storage": "disconnected",
        "gemini": "configured" if settings.GEMINI_API_KEY else "unconfigured"
    }
    
    # Test DB
    try:
        from sqlmodel import Session, select
        with Session(engine) as session:
            session.exec(select(1)).first()
            health["database"] = "connected"
    except Exception:
        health["status"] = "unhealthy"
        
    # Test Supabase Storage
    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
        buckets = supabase.storage.list_buckets()
        health["storage"] = "connected"
    except Exception:
        health["status"] = "unhealthy"
        
    return health

@app.get("/health/db")
async def health_db(session: Session = Depends(get_session)):
    try:
        # Verify database connection by executing a simple query
        session.exec(text("SELECT 1")).first()
        return {"status": "Database connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)



