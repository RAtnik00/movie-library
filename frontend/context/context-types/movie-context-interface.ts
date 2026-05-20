import { Movie } from "@/components/types/movie";

export interface MoviesContextType {
  movies: Movie[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  refreshMovies: () => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  toggleFavorite: (id: string) => void;
  deleteMovie: (id: string) => void;
}
