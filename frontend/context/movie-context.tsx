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
  error: string | null;
  refreshMovies: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  deleteMovie: (id: string) => void;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMovies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
    } catch {
      setError("Failed to load movies");
    } finally {
      setIsLoading(false);
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
        error,
        refreshMovies,
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
