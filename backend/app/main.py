from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def test_route():
    return {"Hello": "World"}