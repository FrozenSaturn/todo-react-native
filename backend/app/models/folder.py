from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Folder(Base):
    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="folders")
    todos = relationship("Todo", back_populates="folder")
