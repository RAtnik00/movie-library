import { Image, Pressable, StyleSheet } from "react-native";
import { Movie } from "./types/movie";

interface MovieCardProps extends Movie {
  onPress: () => void;
}

const POSTER_FALLBACK =
  "https://dummyimage.com/500x750/1b1d1f/ffffff&text=No+Poster";

export default function MovieCard({ poster, onPress }: MovieCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image
        source={{ uri: poster || POSTER_FALLBACK }}
        style={styles.poster}
        resizeMode="cover"
        onError={(e) => {
          e.currentTarget.setNativeProps({
            src: [{ uri: POSTER_FALLBACK }],
          });
        }}
      />
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
});
