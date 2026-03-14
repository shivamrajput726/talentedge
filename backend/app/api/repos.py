from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.repository import Repository
from ..services.analyzer import analyzer_service
from pydantic import BaseModel

router = APIRouter(prefix="/repos", tags=["repositories"])

class RepoCreate(BaseModel):
    url: str

@router.post("/analyze")
async def analyze_repo(repo_in: RepoCreate, db: Session = Depends(get_db)):
    # Check if exists
    db_repo = db.query(Repository).filter(Repository.url == repo_in.url).first()
    if db_repo:
        return db_repo

    # Fetch basic info
    repo_data = analyzer_service.fetch_repo_details(repo_in.url)
    if not repo_data:
        raise HTTPException(status_code=404, detail="Repository not found")

    # Save initial record
    new_repo = Repository(
        url=repo_in.url,
        name=repo_data.get("name"),
        description=repo_data.get("description"),
        language=repo_data.get("language"),
        stars=repo_data.get("stargazers_count"),
        analysis_status="analyzing"
    )
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)

    # In a real app, this should be BackgroundTask
    # For now, we simulate quick analysis
    analysis = await analyzer_service.analyze_skills(repo_data, repo_data.get("description", ""))
    
    new_repo.skills_detected = analysis.get("skills")
    new_repo.ai_summary = analysis.get("summary")
    new_repo.analysis_status = "completed"
    db.commit()
    
    return new_repo

@router.get("/")
def list_repos(db: Session = Depends(get_db)):
    return db.query(Repository).all()
