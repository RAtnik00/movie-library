import WatchlistCard from "@/components/movie-card-list";
import { useAuth } from "@/context/auth-context";
import { useMovies } from "@/context/movie-context";
import { removeFavorite } from "@/lib/api";
import { useRouter } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const router = useRouter();
  const { movies, toggleFavorite } = useMovies();
  const { getAccessToken } = useAuth();

  const favorites = movies.filter((m) => m.favorite);

  const handleRemove = async (id: string) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    toggleFavorite(id);
    try {
      await removeFavorite(Number(id), token);
    } catch {
      toggleFavorite(id);
      Alert.alert("Error", "Failed to remove from favorites");
    }
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Favorites</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No favorites yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Favorites</Text>
      <FlatList
        data={favorites}
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
