import { Movie } from "@/components/types/movie";
import { getPopularMovies } from "@/lib/api";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface MoviesContextType {
  movies: Movie[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  refreshMovies: () => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  deleteMovie: (id: string) => void;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const refreshMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPage(1);
      const popularMovies = await getPopularMovies(1);
      setMovies(popularMovies);
    } catch {
      setError("Failed to load movies");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (isLoadingMore) return; // prevent duplicate requests
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const moreMovies = await getPopularMovies(nextPage);
      setMovies((prev) => [...prev, ...moreMovies]);
      setPage(nextPage);
    } catch {
      // silently fail on pagination — don't replace the whole screen with an error
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    refreshMovies();
  }, []);

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
