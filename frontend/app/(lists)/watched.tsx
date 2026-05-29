import WatchlistCard from "@/components/movie-card-list";
import { useAuth } from "@/context/auth-context";
import { useMovies } from "@/context/movie-context";
import { removeWatched, addFavorite, removeFavorite } from "@/lib/api";
import { useRouter } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WatchedScreen() {
  const router = useRouter();
  const { movies, toggleFavorite, toggleWatched } = useMovies();
  const { getAccessToken } = useAuth();

  const watched = movies.filter((m) => m.watched);

  const handleRemove = async (id: string) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    toggleWatched(id);
    try {
      await removeWatched(Number(id), token);
    } catch {
      toggleWatched(id);
      Alert.alert("Error", "Failed to remove from watched");
    }
  };

  if (watched.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Watched</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No watched movies yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Watched</Text>
      <FlatList
        data={watched}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <WatchlistCard
            movie={item}
            onPress={() => router.push(`/explore/${item.id}`)}
            onRemove={() => handleRemove(item.id)}
          />
        )}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b1d1f" },
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  grid: { paddingHorizontal: 3 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#25282b", fontSize: 16 },
});
