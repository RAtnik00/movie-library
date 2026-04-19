import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Movie } from "./types/movie";

interface MovieCardProps extends Movie {
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onPress: () => void;
}

export default function MovieCard({
  id,
  favorite,
  poster,
  onToggleFavorite,
  onPress,
}: MovieCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image
        source={{ uri: poster }}
        style={styles.poster}
        resizeMode="cover"
      />

      <View style={styles.overlay}>
        <Pressable
          onPress={() => onToggleFavorite(id)}
          style={styles.iconButton}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={18}
            color={favorite ? "#ff4d4d" : "white"}
          />
        </Pressable>
      </View>
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
  overlay: {
    position: "absolute",
    top: 4,
    right: 4,
    gap: 6,
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  deleteButton: {
    backgroundColor: "#D11A2A",
    borderRadius: 6,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
