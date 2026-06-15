import { Movie } from "@/components/types/movie";
import { apiRequest, TMDB_IMAGE_BASE_URL, POSTER_FALLBACK_URL } from "./client";

export async function getFavorites(access_token: string): Promise<Movie[]> {
  const data = await apiRequest<any[]>("/api/favorites", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  return data.map((item) => ({
    id: String(item.movie.tmdb_id),
    title: item.title ?? "Untitled",
    director: "Unknown director",
    release_date: item.release_date?.slice(0, 4) || "Unknown",
    score: 0,
    adult: item.adult ?? false,
    favorite: true,
    watched: false,
    watchlisted: false,
    poster: item.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}`
      : POSTER_FALLBACK_URL,
    desc: item.overview || "No description available.",
  }));
}

export async function addFavorite(
  tmdb_id: number,
  access_token: string,
): Promise<void> {
  return apiRequest("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ tmdb_id }),
  });
}

export async function removeFavorite(
  tmdb_id: number,
  access_token: string,
): Promise<void> {
  return apiRequest(`/api/favorites/${tmdb_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
