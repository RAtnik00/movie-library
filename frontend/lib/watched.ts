import { Movie } from "@/components/types/movie";
import { apiRequest, TMDB_IMAGE_BASE_URL, POSTER_FALLBACK_URL } from "./client";

export async function getWatched(access_token: string): Promise<Movie[]> {
  const data = await apiRequest<any[]>("/api/watched", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return data.map((item) => ({
    id: String(item.movie.tmdb_id),
    title: item.movie.title ?? "Untitled",
    director: "Unknown director",
    release_date: item.release_date?.slice(0, 4) || "Unknown",
    score: 0,
    adult: false,
    favorite: false,
    watched: true,
    watchlisted: false,
    poster: item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.movie.poster_path}`
      : POSTER_FALLBACK_URL,
    desc: item.overview || "No description available.",
  }));
}

export async function addWatched(
  tmdb_id: number,
  access_token: string,
): Promise<void> {
  return apiRequest("/api/watched", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ tmdb_id }),
  });
}

export async function removeWatched(
  tmdb_id: number,
  access_token: string,
): Promise<void> {
  return apiRequest(`/api/watched/${tmdb_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}

export async function setWatchedRating(
  tmdb_id: number,
  rating: number,
  access_token: string,
): Promise<void> {
  return apiRequest(`/api/watched/${tmdb_id}/rating`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ rating }),
  });
}
