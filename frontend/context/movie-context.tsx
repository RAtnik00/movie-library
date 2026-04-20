import { Movie } from "@/components/types/movie";
import { createContext, ReactNode, useContext, useState } from "react";

const initialMovies: Movie[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    release_date: "1984",
    score: 8.6,
    favorite: false,
    poster: "https://cdng.europosters.eu/pod_public/1300/262807.jpg",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt sed ligula rutrum molestie. Praesent et interdum orci. Phasellus sed ligula pharetra, aliquet mi non, dictum nisi. Fusce efficitur iaculis ex, malesuada sollicitudin lorem congue sit amet. Phasellus urna dui, euismod vitae lacus non, pharetra rutrum massa.",
  },
  {
    id: "2",
    title: "The Godfather",
    director: "Francis Ford Coppola",
    release_date: "1997",
    score: 9.2,
    favorite: false,
    poster: "https://cdng.europosters.eu/pod_public/1300/262788.jpg",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt sed ligula rutrum molestie. Praesent et interdum orci. Phasellus sed ligula pharetra, aliquet mi non, dictum nisi. Fusce efficitur iaculis ex, malesuada sollicitudin lorem congue sit amet. Phasellus urna dui, euismod vitae lacus non, pharetra rutrum massa.",
  },
  {
    id: "3",
    title: "Scary Movie",
    director: "Keenen Ivory Wayans",
    release_date: "2001",
    score: 7.0,
    favorite: true,
    poster:
      "https://m.media-amazon.com/images/I/71EWBeJ+imL._AC_UF894,1000_QL80_.jpg",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt sed ligula rutrum molestie. Praesent et interdum orci. Phasellus sed ligula pharetra, aliquet mi non, dictum nisi. Fusce efficitur iaculis ex, malesuada sollicitudin lorem congue sit amet. Phasellus urna dui, euismod vitae lacus non, pharetra rutrum massa.",
  },
];

interface MoviesContextType {
  movies: Movie[];
  toggleFavorite: (id: string) => void;
  deleteMovie: (id: string) => void;
}

const MoviesContext = createContext<MoviesContextType | null>(null);

export function MoviesProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);

  const toggleFavorite = (id: string) =>
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m)),
    );

  const deleteMovie = (id: string) =>
    setMovies((prev) => prev.filter((m) => m.id !== id));

  return (
    <MoviesContext.Provider value={{ movies, toggleFavorite, deleteMovie }}>
      {children}
    </MoviesContext.Provider>
  );
}

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMovies must be used within MoviesProvider");
  return ctx;
}
