import { useMovies } from "@/context/movie-context";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POSTER_FALLBACK =
  "https://dummyimage.com/500x750/1b1d1f/ffffff&text=No+Poster";

type CollectionConfig = {
  label: string;
  route: string;
  countKey: "watchlisted" | "favorite" | "watched";
};

const COLLECTIONS: CollectionConfig[] = [
  { label: "Watched", route: "/(lists)/watched", countKey: "watched" },
  { label: "Watchlist", route: "/(lists)/watchlist", countKey: "watchlisted" },
  { label: "Favorite", route: "/(lists)/favorite", countKey: "favorite" },
];

export default function ListHubScreen() {
  const router = useRouter();
  const { movies } = useMovies();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {COLLECTIONS.map((col) => {
          const collection = movies.filter((m) => m[col.countKey]);
          const count = collection.length;
          const posters = collection.slice(-6).map((m) => m.poster);

          return (
            <Pressable
              key={col.label}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(col.route as any)}
            >
              <View style={styles.info}>
                <Text style={styles.cardHeader}>{col.label}</Text>
                <Text style={styles.cardCount}>{count} films</Text>
              </View>

              <View style={styles.posterWrapper}>
                {posters.length === 0 ? (
                  <Image
                    source={{ uri: POSTER_FALLBACK }}
                    style={[styles.poster, { left: 0 }]}
                    resizeMode="cover"
                  />
                ) : (
                  posters.map((uri, i) => (
                    <Image
                      key={i}
                      source={{ uri: uri ?? POSTER_FALLBACK }}
                      style={[
                        styles.poster,
                        {
                          left: i * 55,
                        },
                      ]}
                      resizeMode="cover"
                    />
                  ))
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b1d1f", paddingTop: 20 },
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    paddingLeft: 16,
    paddingVertical: 14,
  },
  grid: { paddingHorizontal: 16, gap: 14 },
  card: {
    backgroundColor: "#252729",
    borderRadius: 14,
    overflow: "hidden",
    flexDirection: "column",
  },
  cardPressed: { opacity: 0.7 },
  info: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 2,
  },
  cardHeader: { color: "white", fontSize: 17, fontWeight: "600" },
  cardCount: { color: "#6b7280", fontSize: 14 },
  posterWrapper: {
    height: 110,
    position: "relative",
  },
  poster: {
    position: "absolute",
    width: 80,
    height: 110,
    borderColor: "#1b1d1f",
  },
});
