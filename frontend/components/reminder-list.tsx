import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MovieReminder } from "@/components/types/MovieReminder";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const POSTER_FALLBACK =
  "https://dummyimage.com/500x750/1b1d1f/ffffff&text=No+Poster";

function getPosterUrl(path: string | null): string {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : POSTER_FALLBACK;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );
}

interface Props {
  reminders: MovieReminder[];
  isLoading: boolean;
  onEdit: (reminder: MovieReminder) => void;
  onDelete: (id: number) => void;
}

export default function MovieReminders({
  reminders,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const today = new Date();

  if (isLoading) {
    return <ActivityIndicator color="#f1f1f1" style={styles.loader} />;
  }

  if (reminders.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No reminders set.</Text>
      </View>
    );
  }

  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.remind_at).getTime() - new Date(b.remind_at).getTime(),
  );

  return (
    <FlatList
      data={sortedReminders}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isPast = new Date(item.remind_at) < today;
        return (
          <View style={[styles.card, isPast && styles.cardPast]}>
            <Image
              source={{ uri: getPosterUrl(item.movie.poster_path) }}
              style={styles.poster}
              resizeMode="cover"
            />

            <View style={styles.cardLeft}>
              <Text style={styles.movieTitle}>{item.movie.title}</Text>
              <Text style={[styles.dateText, isPast && styles.dateTextPast]}>
                {formatDateTime(item.remind_at)}
              </Text>
              {item.note && <Text style={styles.noteText}>{item.note}</Text>}
            </View>

            <View style={styles.cardActions}>
              <Pressable hitSlop={8} onPress={() => onEdit(item)}>
                <Ionicons name="pencil-outline" size={16} color="#9ca3af" />
              </Pressable>

              <Pressable hitSlop={8} onPress={() => onDelete(item.id)}>
                <Ionicons name="trash-outline" size={16} color="#9ca3af" />
              </Pressable>
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: 40 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 10,
  },
  card: {
    backgroundColor: "#25282b",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  poster: {
    width: 46,
    height: 69,
    borderRadius: 6,
  },
  cardPast: {
    opacity: 0.5,
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  movieTitle: {
    color: "#11b74e",
    fontWeight: "700",
    fontSize: 14,
  },
  dateText: {
    color: "white",
    fontSize: 13,
  },
  dateTextPast: {
    color: "#9ca3af",
  },
  noteText: {
    color: "#9ca3af",
    fontSize: 13,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
});
