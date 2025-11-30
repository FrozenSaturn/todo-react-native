from typing import List, Optional
from pydantic import BaseModel

class SubTaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    class Config:
        from_attributes = True

class TodoBase(BaseModel):
    title: str
    completed: Optional[bool] = False
    folder_id: Optional[int] = None

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    folder_id: Optional[int] = None

class Todo(TodoBase):
    id: int
    user_id: int
    subtasks: List[SubTaskOut] = []

    class Config:
        from_attributes = True
