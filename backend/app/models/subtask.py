from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class SubTask(Base):
    __tablename__ = "subtasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    completed = Column(Boolean, default=False)
    todo_id = Column(Integer, ForeignKey("todos.id"))

    todo = relationship("Todo", back_populates="subtasks")
