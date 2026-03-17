import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Movie = {
  id: string;
  title: string;
  director: string;
  score: number;
  favorite: boolean;
};

export default function ListScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const [movies, setMovies] = useState<Movie[]>([
    {
      id: "1",
      title: "The Shawshank Redemption",
      director: "Frank Darabont",
      score: 8.6,
      favorite: false,
    },
    {
      id: "2",
      title: "The Godfather",
      director: "Francis Ford Coppola",
      score: 9.2,
      favorite: false,
    },
    {
      id: "3",
      title: "Scary Movie",
      director: "Keenen Ivory Wayans",
      score: 7.0,
      favorite: true,
    },
  ]);

  const toggleFavorite = (id: string) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id ? { ...movie, favorite: !movie.favorite } : movie,
      ),
    );
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search bar</Text>
      <TextInput
        style={styles.input}
        placeholder="Your movie"
        placeholderTextColor="#b5a5a5"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                <Ionicons
                  name={item.favorite ? "star" : "star-outline"}
                  size={24}
                  color={item.favorite ? "#FFD700" : "white"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>Director: {item.director}</Text>
            <Text style={styles.cardText}>Score: {item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 50,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222020",
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
  card: {
    backgroundColor: "#222020",
    padding: 15,
    borderRadius: 5,
    marginTop: 15,
  },
  header: {
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
});
