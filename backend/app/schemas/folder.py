from typing import List, Optional
from pydantic import BaseModel
from app.schemas.todo import Todo

class FolderBase(BaseModel):
    title: str

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: int
    user_id: int
    todos: List[Todo] = []

    class Config:
        from_attributes = True
