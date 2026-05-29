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
  {
    label: "Watchlist",
    route: "/(lists)/watchlist",
    countKey: "watchlisted",
  },
  {
    label: "Favorite",
    route: "/(lists)/favorite",
    countKey: "favorite",
  },
  {
    label: "Watched",
    route: "/(lists)/watched",
    countKey: "watched",
  },
];

export default function ListHubScreen() {
  const router = useRouter();
  const { movies } = useMovies();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Lists</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {COLLECTIONS.map((col) => {
          const collection = movies.filter((m) => m[col.countKey]);
          const count = collection.length;
          const lastPoster = collection.at(-1)?.poster ?? null;

          return (
            <Pressable
              key={col.label}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(col.route as any)}
            >
              <View style={styles.posterWrapper}>
                <Image
                  source={{ uri: lastPoster ?? POSTER_FALLBACK }}
                  style={styles.poster}
                  resizeMode="cover"
                />
                <View />
              </View>

              <View style={styles.info}>
                <Text style={styles.cardHeader}>{col.label}</Text>
                <Text style={styles.cardCount}>{count} films</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b1d1f" },
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    paddingLeft: 16,
    paddingVertical: 14,
  },
  grid: { paddingHorizontal: 16, gap: 12 },
  card: {
    backgroundColor: "#252729",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    height: 120,
  },
  cardPressed: { opacity: 0.7 },
  posterWrapper: {
    width: 90,
    height: 120,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 4,
  },
  cardHeader: { color: "white", fontSize: 17, fontWeight: "600" },
  cardCount: { color: "#6b7280", fontSize: 14 },
});
