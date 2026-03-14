import sys
import os
import pytest
from unittest.mock import MagicMock

# Add the backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

@pytest.fixture(autouse=True)
def mock_db(monkeypatch):
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.db.database import get_db, Base
    from app.main import app

    TEST_DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    monkeypatch.setenv("DATABASE_URL", TEST_DATABASE_URL)
    yield
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(autouse=True)
def mock_analyzer(monkeypatch):
    # Mock the LLM call globally to avoid hitting OpenAI in tests
    from app.services.analyzer import GitHubAnalyzer
    
    async def mock_analyze_skills(self, repo_data, readme_content):
        return {
            "skills": {"Python": 0.9, "React": 0.8},
            "summary": "This is a mocked summary for testing."
        }
    
    monkeypatch.setattr(GitHubAnalyzer, "analyze_skills", mock_analyze_skills)
    
    # Also mock fetch_repo_details to avoid network calls
    def mock_fetch_repo_details(self, repo_url):
        return {
            "name": "test-repo",
            "description": "test description",
            "language": "Python",
            "stargazers_count": 10
        }
    
    monkeypatch.setattr(GitHubAnalyzer, "fetch_repo_details", mock_fetch_repo_details)
