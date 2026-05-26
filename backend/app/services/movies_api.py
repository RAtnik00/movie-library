import httpx


class MoviesAPIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    def _get(self, path: str, params: dict | None = None):
        url = f"{self.base_url}{path}"
        request_params = {
            "api_key": self.api_key,
            **(params or {}),
        }

        response = httpx.get(url, params=request_params, timeout=10.0)
        response.raise_for_status()
        return response.json()

<<<<<<< HEAD
    def get_popular(self, page: int = 1):
        return self._get("/movie/popular", {"page": page})
=======
    def get_popular(self):
        return self._get("/movie/popular", {"page": 1})
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7

    def get_search(self, query: str):
        return self._get("/search/movie", {"page": 1, "query": query})

    def get_movie(self, movie_id: int):
        return self._get(f"/movie/{movie_id}")
<<<<<<< HEAD

    def get_movie_with_credits(self, movie_id: int):
        return self._get(
            f"/movie/{movie_id}",
            {"append_to_response": "credits"},
        )
=======
>>>>>>> bf9dfd259fd9cb7334ca2b582fc89a6e2a9f57e7
