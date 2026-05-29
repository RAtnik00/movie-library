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
  onToggleFavorite: (id: string) => void;
  onMarkWatched: (id: string) => void;
  onToggleWatchlist: (id: string) => void;
  onBack: () => void;
}

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function MovieDetailsView({
  movie,
  onToggleFavorite,
  onMarkWatched,
  onToggleWatchlist,
  onBack,
}: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(movie.favorite);
  const [isWatched, setIsWatched] = useState(movie.watched);
  const [isWatchlisted, setIsWatchlisted] = useState(movie.watchlisted);

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    onToggleFavorite(movie.id);
  };

  const handleMarkWatched = () => {
    setIsWatched((prev) => !prev);
    onMarkWatched(movie.id);
  };

  const handleToggleWatchlist = () => {
    setIsWatchlisted((prev) => !prev);
    onToggleWatchlist(movie.id);
  };

  return (
    <ScrollView style={styles.container}>
      {/*Toolbar*/}

      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Ionicons
            name="arrow-back"
            size={22}
            color="white"
            style={styles.headerIcon}
          />
        </Pressable>
        <View style={styles.headerIcons}>
          <Pressable onPress={handleToggleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#ff4d4d" : "white"}
              style={styles.headerIcon}
            />
          </Pressable>

          <Pressable onPress={handleMarkWatched} style={styles.headerIcon}>
            <Ionicons
              name={isWatched ? "eye" : "eye-outline"}
              size={22}
              color={isWatched ? "#d0ff4d" : "white"}
            />
          </Pressable>

          <Pressable
            onPress={() => setMenuVisible(true)}
            style={styles.headerIcon}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      {/* Poster + info */}

      <View style={styles.topSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.title}>{movie.title}</Text>

          {movie.tagline ? (
            <Text style={styles.tagline}>"{movie.tagline}"</Text>
          ) : null}

          <Text style={styles.timeDesc}>
            {movie.release_date}
            {movie.runtime ? ` • ${formatRuntime(movie.runtime)}` : ""}
          </Text>

          <Ionicons name="star" style={styles.score} size={16}>
            {movie.score}
          </Ionicons>
        </View>

        <Image
          source={{ uri: movie.poster }}
          style={styles.poster}
          resizeMode="contain"
        />
      </View>

      {/* Genres */}

      {movie.genres && movie.genres.length > 0 && (
        <View style={styles.genreRow}>
          {movie.genres.map((g) => (
            <View key={g.id} style={styles.genreBadge}>
              <Text style={styles.genreText}>{g.name}</Text>
            </View>
          ))}
        </View>
      )}

      {/*Desc */}

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.desc}>{movie.desc}</Text>

      <EllipsisMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        isWatched={isWatched}
        onMarkWatched={handleMarkWatched}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1d1f",
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
  headerIcon: {
    backgroundColor: "#2a2d2f",
    borderRadius: 18,
    padding: 6,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBlock: {
    flex: 1,
    paddingRight: 12,
  },
  poster: {
    width: 120,
    aspectRatio: 2 / 3,
    borderRadius: 12,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
  },
  tagline: {
    color: "#888",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 4,
  },
  timeDesc: {
    color: "#aaa",
    marginTop: 6,
    fontSize: 13,
  },
  score: {
    color: "#e6b800",
    marginTop: 6,
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 14,
  },
  genreBadge: {
    backgroundColor: "#2a2d2f",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  genreText: {
    color: "#ccc",
    fontSize: 12,
  },
  sectionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 6,
  },
  desc: {
    color: "#ddd",
    lineHeight: 22,
    fontSize: 14,
    marginBottom: 30,
  },
});
