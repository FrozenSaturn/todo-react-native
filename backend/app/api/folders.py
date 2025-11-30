from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.core.database import get_db
from app.crud import folder as folder_crud
from app.models.user import User
from app.schemas.folder import Folder, FolderCreate

router = APIRouter(prefix="/folders", tags=["folders"])

@router.get("/", response_model=List[Folder])
def read_folders(
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return folder_crud.get_folders(db, user_id=current_user.id)

@router.post("/", response_model=Folder)
def create_folder(
    folder: FolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return folder_crud.create_folder(db=db, folder=folder, user_id=current_user.id)
