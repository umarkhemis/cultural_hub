
from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_health_live():
    response = client.get("/api/v1/health/live")
    assert response.status_code == 200