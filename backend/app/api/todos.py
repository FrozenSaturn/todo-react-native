from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.core.database import get_db
from app.crud import todo as todo_crud
from app.models.user import User
from app.schemas.todo import Todo, TodoCreate, TodoUpdate

router = APIRouter(prefix="/todos", tags=["todos"])

@router.post("/", response_model=Todo)
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    return todo_crud.create_user_todo(db=db, todo=todo, user_id=current_user.id)

@router.get("/", response_model=List[Todo])
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    todos = todo_crud.get_todos(db, user_id=current_user.id, skip=skip, limit=limit)
    return todos

@router.put("/{todo_id}", response_model=Todo)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    todo = todo_crud.update_todo(db, todo_id=todo_id, todo_update=todo_update, user_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

@router.delete("/{todo_id}", response_model=Todo)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    todo = todo_crud.delete_todo(db, todo_id=todo_id, user_id=current_user.id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo

from app.schemas.subtask import SubTask, SubTaskCreate
from app.crud import subtask as subtask_crud

@router.post("/{todo_id}/subtasks", response_model=SubTask)
def create_subtask(
    todo_id: int,
    subtask: SubTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    # Verify todo belongs to user
    todo = todo_crud.get_todo(db, todo_id=todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    return subtask_crud.create_subtask(db=db, subtask=subtask, todo_id=todo_id)


from pydantic import BaseModel

class SubTaskUpdate(BaseModel):
    completed: bool

@router.put("/{todo_id}/subtasks/{subtask_id}", response_model=SubTask)
def update_subtask(
    todo_id: int,
    subtask_id: int,
    subtask_update: SubTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
):
    # Verify todo belongs to user
    todo = todo_crud.get_todo(db, todo_id=todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Verify subtask belongs to todo (optional but good practice)
    # For now, relying on CRUD to find by ID, but strictly we should check relation.
    # However, CRUD update_subtask just finds by ID.
    # Let's trust the ID for now, or check if subtask.todo_id == todo_id if we fetched it.
    
    updated_subtask = subtask_crud.update_subtask(db, subtask_id=subtask_id, completed=subtask_update.completed)
    if not updated_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    
    # Sync parent todo completion status
    # Refresh todo to ensure we have the latest subtasks state
    db.refresh(todo)
    
    if todo.subtasks:
        all_completed = all(sub.completed for sub in todo.subtasks)
        if todo.completed != all_completed:
            todo.completed = all_completed
            db.add(todo)
            db.commit()
            
    return updated_subtask
