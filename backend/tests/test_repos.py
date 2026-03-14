from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine
import pytest
import os

client = TestClient(app)

def test_analyze_repo_mocked():
    # Since we mocked GithubAnalyzer in conftest.py, this won't hit the network or OpenAI
    url = f"https://github.com/user/test-repo-{os.getpid()}"

    response = client.post("/repos/analyze", json={"url": url})
    data = response.json()

    # Validate response structure safely
    assert "name" in data, f"Key 'name' missing from response: {data}"
    assert data.get("name") == "test-repo", f"Expected repo name 'test-repo', got '{data.get('name')}'"
    assert data.get("analysis_status") == "completed"
    assert "Python" in data.get("skills_detected", [])