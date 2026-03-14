from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from ..db.database import Base

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(Text)
    language = Column(String)
    stars = Column(Integer)
    analysis_status = Column(String, default="pending")  # pending, analyzing, completed, failed
    skills_detected = Column(JSON)  # e.g., {"React": 0.8, "Python": 0.9}
    ai_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
