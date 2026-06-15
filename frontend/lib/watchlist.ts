import { Movie } from "@/components/types/movie";
import { apiRequest, TMDB_IMAGE_BASE_URL, POSTER_FALLBACK_URL } from "./client";

export async function getWatchlist(access_token: string): Promise<Movie[]> {
  const data = await apiRequest<any[]>("/api/watchlist", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return data.map((item) => ({
    id: String(item.movie.tmdb_id),
    title: item.movie.title ?? "Untitled",
    director: "Unknown director",
    release_date: "Unknown",
    score: 0,
    adult: false,
    favorite: false,
    watched: false,
    watchlisted: true,
    poster: item.movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.movie.poster_path}`
      : POSTER_FALLBACK_URL,
    desc: "No description available.",
  }));
}

export async function addWatchlist(
  tmdb_id: number,
  access_token: string,
): Promise<void> {
  return apiRequest("/api/watchlist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ tmdb_id }),
  });
}

export async function removeWatchlist(
  tmdb_id: number,
  access_token: string,
): Promise<void> {
  return apiRequest(`/api/watchlist/${tmdb_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
