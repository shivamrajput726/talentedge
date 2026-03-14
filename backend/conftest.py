import sys
import os
import pytest
from unittest.mock import MagicMock

# Add the backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

@pytest.fixture(autouse=True)
def mock_settings(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "sk-test-key")
    monkeypatch.setenv("DATABASE_URL", "sqlite:///./test.db")

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
