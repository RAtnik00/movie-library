import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { useMovies } from "@/context/movie-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { movies, isLoading, error, refreshMovies, toggleFavorite } =
    useMovies();

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

      {!isLoading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refreshMovies} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard
              {...item}
              onPress={() =>
                router.push(
                  {
                    pathname: "/explore/[movieId]",
                    params: { movieId: item.id },
                  } as never,
                )
              }
              onToggleFavorite={toggleFavorite}
            />
          )}
        />
      )}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    color: "#f1f0ff",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#2f6f4e",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
});
