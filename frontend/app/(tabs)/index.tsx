import { useAuth } from "@/context/auth-context";
import { useMovies } from "@/context/movie-context";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ProfileCard() {
  const { user } = useAuth();
  const { movies } = useMovies();

  const watchedCount = movies.filter((m) => m.watched).length;
  const favoriteCount = movies.filter((m) => m.favorite).length;
  const watchlistCount = movies.filter((m) => m.watchlisted).length;

  const stats = [
    { label: "Watched", value: String(watchedCount) },
    { label: "Favorite", value: String(favoriteCount) },
    { label: "Watchlist", value: String(watchlistCount) },
  ];

  return (
    <View style={styles.screen}>
      <Ionicons name="settings-outline" size={30} style={styles.settingIcon} />
      <View style={styles.container}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ9Db5WtT-GdWS_C4be_YNL_Oc9FCbWL6tVw&s",
            }}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.name}>{user?.username ?? "—"}</Text>

        <View style={styles.statsRow}>
          {stats.map((stat, i, arr) => (
            <View
              key={stat.label}
              style={[styles.statItem, i < arr.length - 1 && styles.statBorder]}
            >
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1b1d1f",
    padding: 20,
    paddingTop: 60,
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  name: {
    color: "#f1f0ff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#25282b",
    borderRadius: 14,
    width: "100%",
    marginBottom: 20,
    overflow: "hidden",
  },
  statItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  statBorder: {
    borderRightWidth: 0.5,
    borderRightColor: "#3a3d42",
  },
  statValue: {
    color: "#f1f0ff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "#6b7280",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  settingIcon: {
    position: "absolute",
    color: "#6b7280",
    top: 40,
    right: 20,
  },
});
