import { Movie } from "@/components/types/movie";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  movie: Movie;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onBack: () => void;
}

export default function MovieDetailsView({
  movie,
  onDelete,
  onToggleFavorite,
  onBack,
}: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <View style={styles.headerIcons}>
          <Pressable onPress={() => onToggleFavorite(movie.id)}>
            <Ionicons
              name={movie.favorite ? "heart" : "heart-outline"}
              size={22}
              color={movie.favorite ? "#ff4d4d" : "white"}
            />
          </Pressable>

          <Pressable
            onPress={() => onDelete(movie.id)}
            style={styles.deleteIcon}
          >
            <Ionicons name="trash" size={18} color="white" />
          </Pressable>
        </View>
      </View>

      <Image source={{ uri: movie.poster }} style={styles.poster} />

      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.meta}>Directed by {movie.director}</Text>
      <Text style={styles.score}>⭐ {movie.score}</Text>

      <Text style={styles.desc}>{movie.desc}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  poster: {
    width: "100%",
    height: 400,
    borderRadius: 12,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },
  meta: {
    color: "#aaa",
    marginTop: 5,
  },
  score: {
    color: "#e6b800",
    marginTop: 5,
  },
  desc: {
    color: "#ddd",
    marginTop: 15,
    lineHeight: 22,
  },
  deleteIcon: {
    backgroundColor: "#D11A2A",
    padding: 7,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
