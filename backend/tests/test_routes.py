from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_route_returns_response():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}
