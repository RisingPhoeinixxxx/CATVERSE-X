from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base
from app.database import engine

import app.models
# ==========================
# Routes
# ==========================

from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.dashboard import router as dashboard_router
from app.routes.report import router as report_router
from app.routes.cats import router as cats_router
from app.routes.map import router as map_router
from app.routes.mission import router as mission_router
from app.routes.shelters import router as shelters_router
from app.routes.adoptions import router as adoptions_router
# ==========================
# Create Database Tables
# ==========================

Base.metadata.create_all(bind=engine)

# ==========================
# FastAPI App
# ==========================

app = FastAPI(
    title="CATVERSE X API",
    description="Backend API for CATVERSE X",
    version="1.0.0"
)

# ==========================
# CORS
# ==========================

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # We'll restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================
# Register Routes
# ==========================

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(dashboard_router)
app.include_router(report_router)
app.include_router(cats_router)
app.include_router(map_router)
app.include_router(mission_router)
app.include_router(shelters_router)
app.include_router(adoptions_router)

# ==========================
# Root API
# ==========================

@app.get("/")
def root():
    return {
        "status": "online",
        "project": "CATVERSE X",
        "message": "Backend Running Successfully 🚀"
    }