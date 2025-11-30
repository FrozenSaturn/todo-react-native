from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Todo(Base):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)

    owner = relationship("User", back_populates="todos")
    folder = relationship("Folder", back_populates="todos")
    subtasks = relationship("SubTask", back_populates="todo", cascade="all, delete-orphan")
