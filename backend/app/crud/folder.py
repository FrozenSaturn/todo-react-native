from sqlalchemy.orm import Session
from app.models.folder import Folder
from app.schemas.folder import FolderCreate

def get_folders(db: Session, user_id: int):
    return db.query(Folder).filter(Folder.user_id == user_id).all()

def create_folder(db: Session, folder: FolderCreate, user_id: int):
    db_folder = Folder(**folder.model_dump(), user_id=user_id)
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder
