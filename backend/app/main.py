from fastapi import FastAPI
from app.core.config import settings
from app.core.database import Base, engine
from app.api import auth, todos, folders
from app.models import user
from app.models import todo
from app.models import folder
from app.models import subtask

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(todos.router)
app.include_router(folders.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
