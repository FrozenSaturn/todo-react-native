from pydantic import BaseModel

class SubTaskBase(BaseModel):
    title: str
    completed: bool = False

class SubTaskCreate(SubTaskBase):
    pass

class SubTask(SubTaskBase):
    id: int
    todo_id: int

    class Config:
        from_attributes = True
