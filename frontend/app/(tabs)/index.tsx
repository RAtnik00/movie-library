import { useAuth } from "@/context/auth-context";
import { useMovies } from "@/context/movie-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileCard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { movies } = useMovies();

  const watchedCount = movies.filter((m) => m.watched).length;
  const favoriteCount = movies.filter((m) => m.favorite).length;
  const watchlistCount = movies.filter((m) => m.watchlisted).length;

  const stats = [
    { label: "Watched", value: String(watchedCount) },
    { label: "Favorite", value: String(favoriteCount) },
    { label: "Watchlist", value: String(watchlistCount) },
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.userHeader}>
          <Text style={styles.name}>{user?.username}</Text>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ9Db5WtT-GdWS_C4be_YNL_Oc9FCbWL6tVw&s",
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat, i, arr) => (
              <View
                key={stat.label}
                style={[
                  styles.statItem,
                  i < arr.length - 1 && styles.statBorder,
                ]}
              >
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.userFunctions}>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
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
    flex: 1,
    justifyContent: "space-between",
  },
  userHeader: {
    width: "100%",
    alignItems: "center",
  },
  userFunctions: {},
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
  logoutBtn: {
    marginTop: 8,
    justifyContent: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3a3d42",
  },
  logoutText: {
    color: "#f1f0ff",
    fontSize: 15,
    fontWeight: "600",
  },
});
