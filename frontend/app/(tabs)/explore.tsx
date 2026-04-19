import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { useMovies } from "@/context/movie-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { movies, toggleFavorite, deleteMovie } = useMovies();

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
            onPress={() =>
              router.push({
                pathname: "/explore/[movieId]",
                params: { movieId: item.id },
              })
            }
            onDelete={(id) =>
              Alert.alert(
                "Deleting",
                "Are you sure you want to delete this movie?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "OK", onPress: () => deleteMovie(id) },
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
