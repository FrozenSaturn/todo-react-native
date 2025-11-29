from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app.crud import user as user_crud
from app.schemas.token import Token
from app.schemas.user import User, UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=User)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_crud.create_user(db=db, user=user)

@router.post("/login", response_model=Token)
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    # Note: We are reusing UserCreate here for simplicity, but typically you might use OAuth2PasswordRequestForm
    # or a specific UserLogin schema. For this task, we'll stick to the plan's implication or standard practice.
    # The plan said "POST /auth/login: Authenticate and return JWT".
    # I'll use UserCreate for input to match the plan's manual verification example which sends JSON.
    
    user = user_crud.get_user_by_email(db, email=user_data.email)
    if not user or not security.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from app.api import deps

@router.get("/me", response_model=User)
def read_users_me(current_user: User = Depends(deps.get_current_user)):
    return current_user
