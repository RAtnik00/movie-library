import { Movie } from "@/components/types/movie";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EllipsisMenu from "./elipsis-menu";

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
  const [menuVisible, setMenuVisible] = useState(false);

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
          <Pressable onPress={() => setMenuVisible(true)}>
            <Ionicons name="ellipsis-vertical" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View style={{ maxWidth: 200 }}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>
            {movie.release_date} <Text>•</Text> DIRECTED BY
          </Text>
          <Text style={styles.dir}>{movie.director}</Text>
          <Text style={styles.score}>⭐ {movie.score}</Text>
        </View>

        <Image
          source={{ uri: movie.poster }}
          style={styles.poster}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.desc}>{movie.desc}</Text>
      <EllipsisMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isFavorite={movie.favorite}
        onToggleFavorite={() => onToggleFavorite(movie.id)}
        onDelete={() => onDelete(movie.id)}
      />
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
    width: 120,
    aspectRatio: 2 / 3,
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
  dir: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 16,
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
