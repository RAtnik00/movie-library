import { Movie } from "@/components/types/movie";
import {
  getFavorites,
  getPopularMovies,
  getWatched,
  getWatchlist,
} from "@/lib/api";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MoviesContextType } from "./context-types/movie-context-interface";

const MoviesContext = createContext<MoviesContextType | null>(null);

function applyFavorites(
  movieList: Movie[],
  favoriteIds: Set<string>,
): Movie[] {
  return movieList.map((movie) => ({
    ...movie,
    favorite: favoriteIds.has(movie.id),
  }));
}

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { getAccessToken, isLoggedIn } = useAuth();

  const fetchFavoriteIds = useCallback(async (): Promise<Set<string>> => {
    try {
      const token = await getAccessToken();
      if (!token) return new Set();

      const favorites = await getFavorites(token);
      return new Set(favorites.map((favorite) => favorite.id));
    } catch {
      return new Set();
    }
  };

  const fetchWatchedIds = async (): Promise<Set<string>> => {
    try {
      const token = await getAccessToken();
      if (!token) return new Set();
      const watched = await getWatched(token);
      return new Set(watched.map((w) => w.id));
    } catch {
      return new Set();
    }
  };

  const fetchWatchlistIds = async (): Promise<Set<string>> => {
    try {
      const token = await getAccessToken();
      if (!token) return new Set();
      const watchlist = await getWatchlist(token);
      return new Set(watchlist.map((w) => w.id));
    } catch {
      return new Set();
    }
  };

  const applyStatuses = (
    movieList: Movie[],
    favoriteIds: Set<string>,
    watchedIds: Set<string>,
    watchlistIds: Set<string>,
  ): Movie[] =>
    movieList.map((m) => ({
      ...m,
      favorite: favoriteIds.has(m.id),
      watched: watchedIds.has(m.id),
      watchlisted: watchlistIds.has(m.id),
    }));

  const refreshMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPage(1);
      const [popularMovies, favoriteIds, watchedIds, watchlistIds] =
        await Promise.all([
          getPopularMovies(1),
          fetchFavoriteIds(),
          fetchWatchedIds(),
          fetchWatchlistIds(),
        ]);
      setMovies(
        applyStatuses(popularMovies, favoriteIds, watchedIds, watchlistIds),
      );
    } catch {
      setError("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  }, [fetchFavoriteIds]);

  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const [moreMovies, favoriteIds, watchedIds, watchlistIds] =
        await Promise.all([
          getPopularMovies(nextPage),
          fetchFavoriteIds(),
          fetchWatchedIds(),
          fetchWatchlistIds(),
        ]);
      setMovies((prev) => [
        ...prev,
        ...applyStatuses(moreMovies, favoriteIds, watchedIds, watchlistIds),
      ]);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchFavoriteIds, isLoadingMore, page]);

  useEffect(() => {
    refreshMovies();
  }, [isLoggedIn, refreshMovies]);

  const toggleFavorite = (id: string) =>
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, favorite: !movie.favorite } : movie,
      ),
    );

  const toggleWatched = (id: string) =>
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, watched: !m.watched } : m)),
    );

  const toggleWatchlisted = (id: string) =>
    setMovies((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, watchlisted: !m.watchlisted } : m,
      ),
    );

  const deleteMovie = (id: string) =>
    setMovies((prev) => prev.filter((movie) => movie.id !== id));

  return (
    <MoviesContext.Provider
      value={{
        movies,
        isLoading,
        isLoadingMore,
        error,
        refreshMovies,
        loadMoreMovies,
        toggleFavorite,
        toggleWatched,
        toggleWatchlisted,
        deleteMovie,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
}
