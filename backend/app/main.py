from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api import repos
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(repos.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to TalentEdge API", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Serve frontend static files
# In Docker, we'll copy the dist folder here
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
