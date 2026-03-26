from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def test_route() -> dict:
    return {"Hello": "World"}