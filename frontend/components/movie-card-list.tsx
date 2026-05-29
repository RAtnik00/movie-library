import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Movie } from "./types/movie";

interface WatchlistCardProps {
  movie: Movie;
  onPress: () => void;
  onRemove: () => void;
}

const POSTER_FALLBACK =
  "https://dummyimage.com/500x750/1b1d1f/ffffff&text=No+Poster";

export default function WatchlistCard({
  movie,
  onPress,
  onRemove,
}: WatchlistCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image
        source={{ uri: movie.poster || POSTER_FALLBACK }}
        style={styles.poster}
        resizeMode="cover"
        onError={(e) => {
          e.currentTarget.setNativeProps({ src: [{ uri: POSTER_FALLBACK }] });
        }}
      />

      <Pressable
        onPress={onRemove}
        style={[styles.badge, styles.badgeTopRight]}
        hitSlop={8}
      >
        <Ionicons name="bookmark" size={16} color="#4daaff" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1 / 3,
    aspectRatio: 2 / 3,
    margin: 3,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  cardPressed: {
    opacity: 0.75,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  badge: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 5,
  },
  badgeTopRight: {
    top: 6,
    right: 6,
  },
});
