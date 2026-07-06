from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select
from typing import Optional
from datetime import datetime

from app.db.database import get_session
from app.db.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])
class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)
    age: Optional[int] = None
    gender: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    created_at: datetime

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_req: UserRegisterRequest, session: Session = Depends(get_session)):
    # Check if email already exists
    statement = select(User).where(User.email == user_req.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_req.password)
    
    # Create user
    new_user = User(
        full_name=user_req.full_name,
        email=user_req.email,
        password_hash=hashed_password,
        age=user_req.age,
        gender=user_req.gender
    )
    
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    return UserResponse(
        id=str(new_user.id),
        full_name=new_user.full_name,
        email=new_user.email,
        created_at=new_user.created_at
    )

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    # OAuth2PasswordRequestForm uses 'username' field, we treat it as email
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(subject=str(user.id))
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        full_name=current_user.full_name,
        email=current_user.email,
        created_at=current_user.created_at
    )
