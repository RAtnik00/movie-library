import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { useMovies } from "@/context/movie-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { movies, toggleFavorite } = useMovies();

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieCard
            {...item}
            onPress={() =>
              router.push({
                pathname: "/explore/[movieId]",
                params: { movieId: item.id },
              })
            }
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#1b1d1f",
  },
  row: {
    justifyContent: "flex-start",
  },
});
