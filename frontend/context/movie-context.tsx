import { Movie } from "@/components/types/movie";
import { getFavorites, getPopularMovies } from "@/lib/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/auth-context";
import { MoviesContextType } from "./context-types/movie-context-interface";

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { getAccessToken, isLoggedIn } = useAuth();

  const fetchFavoriteIds = async (): Promise<Set<string>> => {
    try {
      const token = await getAccessToken();
      if (!token) return new Set();
      const favorites = await getFavorites(token);
      return new Set(favorites.map((f) => f.id));
    } catch {
      return new Set();
    }
  };

  const applyFavorites = (
    movieList: Movie[],
    favoriteIds: Set<string>,
  ): Movie[] =>
    movieList.map((m) => ({ ...m, favorite: favoriteIds.has(m.id) }));

  const refreshMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPage(1);
      const [popularMovies, favoriteIds] = await Promise.all([
        getPopularMovies(1),
        fetchFavoriteIds(),
      ]);
      setMovies(applyFavorites(popularMovies, favoriteIds));
    } catch {
      setError("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const [moreMovies, favoriteIds] = await Promise.all([
        getPopularMovies(nextPage),
        fetchFavoriteIds(),
      ]);
      setMovies((prev) => [
        ...prev,
        ...applyFavorites(moreMovies, favoriteIds),
      ]);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) refreshMovies();
  }, [isLoggedIn]);

  const toggleFavorite = (id: string) =>
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m)),
    );

  const deleteMovie = (id: string) =>
    setMovies((prev) => prev.filter((m) => m.id !== id));

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
