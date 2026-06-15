import { useMovies } from "@/context/movie-context";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function RecentlyWatched() {
  const router = useRouter();
  const { movies } = useMovies();

  const recentlyWatched = movies
    .filter((m) => m.watched)
    .slice(-3)
    .reverse();

  if (recentlyWatched.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Recently Watched</Text>
      <View style={styles.row}>
        {recentlyWatched.map((movie) => (
          <Pressable
            key={movie.id}
            style={styles.item}
            onPress={() => router.push(`/explore/${movie.id}`)}
          >
            <Image
              source={{ uri: movie.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
            <Text style={styles.movieTitle} numberOfLines={1}>
              {movie.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    padding: 20,
    backgroundColor: "#25282b",
    borderRadius: 14,
  },
  title: {
    color: "#f1f0ff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  item: {
    flex: 1,
    gap: 6,
  },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 8,
  },
  movieTitle: {
    color: "#9ca3af",
    fontSize: 11,
    textAlign: "center",
  },
});
