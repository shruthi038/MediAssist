from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, text, SQLModel
import uvicorn

from app.db.database import engine, get_session
from app.db.models import *
from app.api.auth import router as auth_router

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

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "Backend running"}

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



