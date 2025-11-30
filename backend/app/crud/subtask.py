from sqlalchemy.orm import Session
from app.models.subtask import SubTask
from app.schemas.subtask import SubTaskCreate

def create_subtask(db: Session, subtask: SubTaskCreate, todo_id: int):
    db_subtask = SubTask(**subtask.model_dump(), todo_id=todo_id)
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask

def update_subtask(db: Session, subtask_id: int, completed: bool):
    db_subtask = db.query(SubTask).filter(SubTask.id == subtask_id).first()
    if db_subtask:
        db_subtask.completed = completed
        db.add(db_subtask)
        db.commit()
        db.refresh(db_subtask)
    return db_subtask

def delete_subtask(db: Session, subtask_id: int):
    db_subtask = db.query(SubTask).filter(SubTask.id == subtask_id).first()
    if db_subtask:
        db.delete(db_subtask)
        db.commit()
    return db_subtask
