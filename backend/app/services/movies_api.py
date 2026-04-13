import httpx


class MoviesAPIClient:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    def get_popular(self):
        url = f"{self.base_url}/movie/popular"
        params = {"page": 1, "api_key": self.api_key}
        response = httpx.get(url, params=params)
        return response.json()

    def get_search(self, query: str):
        url = f"{self.base_url}/search/movie"
        params = {"page": 1, "query": query, "api_key": self.api_key}
        response = httpx.get(url, params=params)
        return response.json()
