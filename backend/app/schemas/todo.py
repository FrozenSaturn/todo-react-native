from typing import Optional
from pydantic import BaseModel

class TodoBase(BaseModel):
    title: str
    completed: Optional[bool] = False

class TodoCreate(TodoBase):
    pass

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

class Todo(TodoBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
