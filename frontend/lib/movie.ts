import { Movie } from "@/components/types/movie";
import type { TmdbMovie } from "@/components/types/TmbdbMovie";
import type { TmdbMoviesResponse } from "@/components/types/TmdbMoviesResponse";
import { apiRequest, TMDB_IMAGE_BASE_URL, POSTER_FALLBACK_URL } from "./client";

export function mapTmdbMovie(movie: TmdbMovie): Movie {
  return {
    id: String(movie.id),
    title: movie.title ?? "Untitled",
    director: movie.director ?? "Unknown director",
    release_date: movie.release_date?.slice(0, 4) || "Unknown",
    score:
      typeof movie.vote_average === "number"
        ? Number(movie.vote_average.toFixed(1))
        : 0,
    adult: movie.adult ?? false,
    favorite: false,
    watched: false,
    watchlisted: false,
    poster: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : POSTER_FALLBACK_URL,
    desc: movie.overview || "No description available.",
  };
}

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const data = await apiRequest<TmdbMoviesResponse>(`/api/movies?page=${page}`);
  return data.results.map(mapTmdbMovie);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await apiRequest<TmdbMoviesResponse>(
    `/api/movies/search?query=${encodeURIComponent(query)}`,
  );
  return data.results.map(mapTmdbMovie);
}
