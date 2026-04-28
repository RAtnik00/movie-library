// services/movies.ts
import { api } from "./api";
import type { Movie } from "@/components/types/movie";

export type WatchedMovie = Movie & { rating?: number };

// Movies
export const getPopularMovies = () => api.get<Movie[]>("/movies");
export const searchMovies = (query: string) =>
  api.get<Movie[]>(`/movies/search?query=${encodeURIComponent(query)}`);
export const getMovie = (movieId: number) =>
  api.get<Movie>(`/movies/${movieId}`);

// Favorites
export const getFavorites = () => api.get<Movie[]>("/favorites");
export const addFavorite = (tmdb_id: number) =>
  api.post("/favorites", { tmdb_id });
export const removeFavorite = (tmdb_id: number) =>
  api.delete(`/favorites/${tmdb_id}`);

// Watchlist
export const getWatchlist = () => api.get<Movie[]>("/watchlist");
export const addToWatchlist = (tmdb_id: number) =>
  api.post("/watchlist", { tmdb_id });
export const removeFromWatchlist = (tmdb_id: number) =>
  api.delete(`/watchlist/${tmdb_id}`);

// Watched
export const getWatched = () => api.get<WatchedMovie[]>("/watched");
export const addToWatched = (tmdb_id: number) =>
  api.post("/watched", { tmdb_id });
export const removeFromWatched = (tmdb_id: number) =>
  api.delete(`/watched/${tmdb_id}`);
export const setWatchedRating = (tmdb_id: number, rating: number) =>
  api.patch(`/watched/${tmdb_id}/rating`, { rating });
