import { Movie } from "@/components/types/movie";
import { Platform } from "react-native";

const DEFAULT_API_URL =
<<<<<<< HEAD
  Platform.OS === "android"
    ? "http://10.0.2.2:8000"
    : "http://localhost:8000";
=======
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";
>>>>>>> 0a6d1e32bd64ccf3e1153fb217f39baf3d315222

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
  page: number;
  results: TmdbMovie[];
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ?? `API request failed: ${response.status}`,
    );
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

export async function getPopularMovies(page: number = 1): Promise<Movie[]> {
  const data = await apiRequest<TmdbMoviesResponse>(`/api/movies?page=${page}`);
  return data.results.map(mapTmdbMovie);
}

//auth

export async function registerUser(
  username: string,
  email: string,
  password: string,
): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function loginUser(
  username: string,
  password: string,
): Promise<AuthTokens> {
  const body = new URLSearchParams({ username, password });

  return apiRequest<AuthTokens>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

export async function logoutUser(refresh_token: string): Promise<void> {
  return apiRequest("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
}

export async function getMe(access_token: string): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
