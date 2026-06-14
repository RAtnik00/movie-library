import MovieDetailsView from "@/components/movie-details-view";
import { useMovies } from "@/context/movie-context";
import { useAuth } from "@/context/auth-context";
import { Movie } from "@/components/types/movie";
import {
  addFavorite,
  removeFavorite,
  API_URL,
  addWatched,
  removeWatched,
  addWatchlist,
  removeWatchlist,
  createReminder,
} from "@/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ReminderModal from "@/components/reminder-modal";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const POSTER_FALLBACK_URL =
  "https://placehold.co/500x750/1b1d1f/ffffff?text=No+Poster";

export default function MovieDetails() {
  const { movieId } = useLocalSearchParams();

  const router = useRouter();

  const { movies, toggleFavorite, toggleWatched, toggleWatchlisted } =
    useMovies();

  const { getAccessToken } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(
    movies.find((m) => m.id === movieId) ?? null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  const handleCreateReminder = async (date: Date, note: string | null) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    try {
      await createReminder(Number(movie?.id), date, note, token);
      Alert.alert(
        "Reminder set",
        `You'll be reminded on ${date.toLocaleDateString()}`,
      );
    } catch {
      Alert.alert("Error", "Failed to set reminder");
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${API_URL}/api/movies/${movieId}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        setMovie((prev) => ({
          id: String(data.id),
          title: data.title ?? "Untitled",
          director: data.director ?? "Unknown director",
          release_date: data.release_date?.slice(0, 4) || "Unknown",
          score:
            typeof data.vote_average === "number"
              ? Number(data.vote_average.toFixed(1))
              : 0,
          adult: data.adult,
          favorite: prev?.favorite ?? false,
          watched: prev?.watched ?? false,
          watchlisted: prev?.watchlisted ?? false,
          poster: data.poster_path
            ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
            : POSTER_FALLBACK_URL,
          desc: data.overview || "No description available.",
          tagline: data.tagline,
          genres: data.genres,
          runtime: data.runtime,
        }));
      } catch {
        if (!movie) router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleToggleFavorite = async (id: string) => {
    if (!movie) return;

    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in to manage favorites");
      return;
    }

    const tmdbId = Number(id);
    const willBeFavorite = !movie.favorite;

    setMovie((prev) => (prev ? { ...prev, favorite: willBeFavorite } : prev));
    toggleFavorite(id);

    try {
      if (willBeFavorite) {
        await addFavorite(tmdbId, token);
      } else {
        await removeFavorite(tmdbId, token);
      }
    } catch {
      setMovie((prev) =>
        prev ? { ...prev, favorite: !willBeFavorite } : prev,
      );
      toggleFavorite(id);
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const handleMarkWatched = async (id: string) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    const willBeWatched = !movie?.watched;
    setMovie((prev) => (prev ? { ...prev, watched: willBeWatched } : prev));
    toggleWatched(id);
    try {
      if (willBeWatched) {
        await addWatched(Number(id), token);
      } else {
        await removeWatched(Number(id), token);
      }
    } catch {
      setMovie((prev) => (prev ? { ...prev, watched: !willBeWatched } : prev));
      toggleWatched(id);
      Alert.alert("Error", "Failed to update watched status");
    }
  };

  const handleToggleWatchlist = async (id: string) => {
    const token = await getAccessToken();
    if (!token) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    const willBeWatchlisted = !movie?.watchlisted;
    setMovie((prev) =>
      prev ? { ...prev, watchlisted: willBeWatchlisted } : prev,
    );
    toggleWatchlisted(id);
    try {
      if (willBeWatchlisted) {
        await addWatchlist(Number(id), token);
      } else {
        await removeWatchlist(Number(id), token);
      }
    } catch {
      setMovie((prev) =>
        prev ? { ...prev, watchlisted: !willBeWatchlisted } : prev,
      );
      toggleWatchlisted(id);
      Alert.alert("Error", "Failed to update watchlist");
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1b1d1f",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!movie) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MovieDetailsView
        movie={movie}
        onToggleFavorite={handleToggleFavorite}
        onMarkWatched={handleMarkWatched}
        onToggleWatchlist={handleToggleWatchlist}
        onSetReminder={() => setReminderModalVisible(true)}
        onBack={() => router.back()}
      />
      <ReminderModal
        visible={reminderModalVisible}
        onConfirm={handleCreateReminder}
        onClose={() => setReminderModalVisible(false)}
      />
    </SafeAreaView>
  );
}
