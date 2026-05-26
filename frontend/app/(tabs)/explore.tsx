import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { useMovies } from "@/context/movie-context";
import { searchMovies } from "@/lib/api";
import { useRouter } from "expo-router";
<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState } from "react";
>>>>>>> feature/connect-fronted-and-backend
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Movie } from "@/components/types/movie";

export default function ListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
<<<<<<< HEAD
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
=======
  const { movies, isLoading, error, refreshMovies, toggleFavorite } =
    useMovies();
>>>>>>> feature/connect-fronted-and-backend

  const {
    movies,
    isLoading,
    isLoadingMore,
    error,
    refreshMovies,
    loadMoreMovies,
    toggleFavorite,
  } = useMovies();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError(null);
        const results = await searchMovies(searchQuery.trim());
        setSearchResults(results);
        setHasSearched(true);
      } catch {
        setSearchError("Search failed, try again");
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const isInSearchMode = searchQuery.trim().length > 0;
  const displayedMovies = isInSearchMode ? searchResults : movies;
  const showSpinner = isInSearchMode ? isSearching : isLoading;
  const showError = isInSearchMode ? searchError : error;

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

<<<<<<< HEAD
      {showSpinner && (
=======
      {isLoading && (
>>>>>>> feature/connect-fronted-and-backend
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}

<<<<<<< HEAD
      {!showSpinner && showError && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{showError}</Text>
          <Pressable
            onPress={isInSearchMode ? undefined : refreshMovies}
            style={styles.retryButton}
          >
=======
      {!isLoading && error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={refreshMovies} style={styles.retryButton}>
>>>>>>> feature/connect-fronted-and-backend
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}

<<<<<<< HEAD
      {!showSpinner && !showError && (
        <FlatList
          data={displayedMovies}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          onEndReached={() => {
            if (!isInSearchMode) loadMoreMovies();
          }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            isInSearchMode && hasSearched && !isSearching ? (
              <View style={styles.center}>
                <Text style={styles.errorText}>No results found</Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            isLoadingMore && !isInSearchMode ? (
              <ActivityIndicator
                size="small"
                color="#ffffff"
                style={{ paddingVertical: 16 }}
              />
            ) : null
          }
=======
      {!isLoading && !error && (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
>>>>>>> feature/connect-fronted-and-backend
          renderItem={({ item }) => (
            <MovieCard
              {...item}
              onPress={() =>
<<<<<<< HEAD
                router.push({
                  pathname: "/explore/[movieId]",
                  params: { movieId: item.id },
                } as never)
=======
                router.push(
                  {
                    pathname: "/explore/[movieId]",
                    params: { movieId: item.id },
                  } as never,
                )
>>>>>>> feature/connect-fronted-and-backend
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
<<<<<<< HEAD
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
=======
    fontSize: 16,
>>>>>>> feature/connect-fronted-and-backend
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
