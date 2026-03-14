from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, engine
import pytest

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_analyze_repo_mocked():
    # Since we mocked GitHubAnalyzer in conftest.py, this won't hit the network or OpenAI
    response = client.post("/repos/analyze", json={"url": "https://github.com/user/test-repo"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "test-repo"
    assert data["analysis_status"] == "completed"
    assert "Python" in data["skills_detected"]
