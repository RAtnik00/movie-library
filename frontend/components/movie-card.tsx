import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { Pressable, StyleSheet, View } from "react-native";
import { Movie } from "./types/movie";

interface MovieCardProps extends Movie {
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function MovieCard({
  id,
  title,
  director,
  score,
  favorite,
  onDelete,
  onToggleFavorite,
}: MovieCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.iconContainer}>
          <Pressable onPress={() => onToggleFavorite(id)}>
            <Ionicons
              name={favorite ? "star" : "star-outline"}
              size={24}
              color={favorite ? "#FFD700" : "white"}
            />
          </Pressable>
          <Ionicons
            name="trash"
            size={18}
            color="white"
            onPress={() => onDelete(id)}
          />
        </View>
      </View>

      <Text style={styles.cardText}>Director: {director}</Text>
      <Text style={styles.cardText}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  input: {
    color: "#fff",
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 6,
  },
  card: {
    backgroundColor: "#222020",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    color: "#b5a5a5",
    fontSize: 14,
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addIcon: {
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 13,
    padding: 3,
  },
});
