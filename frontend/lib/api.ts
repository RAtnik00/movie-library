import { Movie } from "@/components/types/movie";
import { Platform } from "react-native";

const DEFAULT_API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const POSTER_FALLBACK_URL =
  "https://placehold.co/500x750/1b1d1f/ffffff?text=No+Poster";

type TmdbMovie = {
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  release_date?: string;
  vote_average?: number;
};

type TmdbMoviesResponse = {
  results: TmdbMovie[];
};

async function apiRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

function mapTmdbMovie(movie: TmdbMovie): Movie {
  return {
    id: String(movie.id),
    title: movie.title ?? "Untitled",
    director: "Unknown director",
    release_date: movie.release_date?.slice(0, 4) || "Unknown",
    score:
      typeof movie.vote_average === "number"
        ? Number(movie.vote_average.toFixed(1))
        : 0,
    favorite: false,
    poster: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : POSTER_FALLBACK_URL,
    desc: movie.overview || "No description available.",
  };
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await apiRequest<TmdbMoviesResponse>("/api/movies");
  return data.results.map(mapTmdbMovie);
}
