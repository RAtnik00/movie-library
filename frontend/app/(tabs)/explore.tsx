import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { Movie } from "@/components/types/movie";
import { useState } from "react";
import { Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const [movies, setMovies] = useState<Movie[]>([
    {
      id: "1",
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      score: 8.6,
      favorite: false,
    },
    {
      id: "2",
      title: "The Godfather",
      director: "Francis Ford Coppola",
      score: 9.2,
      favorite: false,
    },
    {
      id: "3",
      title: "Scary Movie",
      director: "Keenen Ivory Wayans",
      score: 7.0,
      favorite: true,
    },
  ]);

  const handleDeleteTrip = (id: string) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, favorite: !movie.favorite } : movie,
      ),
    );
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 12 }}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MovieCard
            {...item}
            onDelete={(id) =>
              Alert.alert(
                "Deleting",
                "Are you sure you want to delete this movie?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "OK",
                    onPress: () => handleDeleteTrip(id),
                  },
                ],
              )
            }
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </SafeAreaView>
  );
}
