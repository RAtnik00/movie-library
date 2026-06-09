import { Movie } from "@/components/types/movie";
import { Platform } from "react-native";
import type { TmdbMovie } from "@/components/types/TmbdbMovie";
import type { AuthTokens } from "@/components/types/AuthTokens";
import type { UserProfile } from "@/components/types/UserProfile";
import type { TmdbMoviesResponse } from "@/components/types/TmdbMoviesResponse";
import { MovieComment } from "@/components/types/MovieComment";

const DEFAULT_API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const POSTER_FALLBACK_URL =
  "https://dummyimage.com/500x750/1b1d1f/ffffff&text=No+Poster";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function getNewToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const AsyncStorage = (
        await import("@react-native-async-storage/async-storage")
      ).default;
      const storedRefresh = await AsyncStorage.getItem("refresh_token");
      if (!storedRefresh) return null;

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefresh }),
      });

      if (!response.ok) return null;

      const tokens = await response.json();
      await AsyncStorage.setItem("access_token", tokens.access_token);
      await AsyncStorage.setItem("refresh_token", tokens.refresh_token);
      return tokens.access_token;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);

  if (response.status === 401) {
    const newToken = await getNewToken();
    if (!newToken) {
      throw new Error("Could not validate credentials");
    }

    const retryOptions: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${newToken}`,
      },
    };

    const retryResponse = await fetch(`${API_URL}${path}`, retryOptions);
    if (!retryResponse.ok) {
      const errorData = await retryResponse.json().catch(() => ({}));
      throw new Error(
        errorData.detail ?? `API request failed: ${retryResponse.status}`,
      );
    }
    return retryResponse.json();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ?? `API request failed: ${response.status}`,
    );
  }

  return response.json();
}

{
  /* Movie Service */
}
function mapTmdbMovie(movie: TmdbMovie): Movie {
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

{
  /* Auth Service */
}

export async function registerUser(
  username: string,
  email: string,
  password: string,
  birthDate: string,
): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, birth_date: birthDate }),
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

export async function refreshToken(refresh_token: string): Promise<AuthTokens> {
  return apiRequest<AuthTokens>("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
}

{
  /* Serach and Favorite Services */
}
export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await apiRequest<TmdbMoviesResponse>(
    `/api/movies/search?query=${encodeURIComponent(query)}`,
  );
  return data.results.map(mapTmdbMovie);
}

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

{
  /* Watched service */
}

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

{
  /* Watchlist Service */
}
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

{
  /* Comments */
}

export async function getMovieComments(
  tmdb_id: number,
): Promise<MovieComment[]> {
  return apiRequest<MovieComment[]>(`/api/comments/movie/${tmdb_id}`);
}

export async function createComment(
  tmdb_id: number,
  text: string,
  access_token: string,
): Promise<MovieComment> {
  return apiRequest<MovieComment>("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ tmdb_id, text }),
  });
}

export async function updateComment(
  comment_id: number,
  text: string,
  access_token: string,
): Promise<MovieComment> {
  return apiRequest<MovieComment>(`/api/comments/${comment_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ text }),
  });
}

export async function deleteComment(
  comment_id: number,
  access_token: string,
): Promise<MovieComment> {
  return apiRequest<MovieComment>(`/api/comments/${comment_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
