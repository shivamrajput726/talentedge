from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine
import pytest
import os

client = TestClient(app)

def test_analyze_repo_mocked():
    # Since we mocked GitHubAnalyzer in conftest.py, this won't hit the network or OpenAI
    url = f"https://github.com/user/test-repo-{os.getpid()}"
    response = client.post("/repos/analyze", json={"url": url})
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()
    assert "name" in data, f"Key 'name' missing from response: {data}"
    assert data["name"] == "test-repo"
    assert data["analysis_status"] == "completed"
    assert "Python" in data["skills_detected"]
