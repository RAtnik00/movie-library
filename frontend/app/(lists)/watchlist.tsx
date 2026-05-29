import WatchlistCard from "@/components/movie-card-list";
import { useAuth } from "@/context/auth-context";
import { useMovies } from "@/context/movie-context";
import { addFavorite, removeFavorite, removeWatchlist } from "@/lib/api";
import { useRouter } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Lists() {
  const router = useRouter();
  const { movies, toggleFavorite, toggleWatchlisted } = useMovies();
  const { getAccessToken } = useAuth();

  const watchlist = movies.filter((m) => m.watchlisted);

  const handleToggleFavorite = async (id: string) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    const willBeFavorite = !movie.favorite;
    toggleFavorite(id);

    try {
      if (willBeFavorite) {
        await addFavorite(Number(id), token);
      } else {
        await removeFavorite(Number(id), token);
      }
    } catch {
      toggleFavorite(id);
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const handleRemove = async (id: string) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    toggleWatchlisted(id);

    try {
      await removeWatchlist(Number(id), token);
    } catch {
      toggleWatchlisted(id);
      Alert.alert("Error", "Failed to remove from watchlist");
    }
  };

  if (watchlist.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.heading}>Watchlist</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your watchlist is empty.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Watchlist</Text>
      <FlatList
        data={watchlist}
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
  container: {
    flex: 1,
    backgroundColor: "#1b1d1f",
  },
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  grid: {
    paddingHorizontal: 3,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#25282b",
    fontSize: 16,
  },
});
