import MovieDetailsView from "@/components/movie-details-view";
import { useMovies } from "@/context/movie-context";
import { useAuth } from "@/context/auth-context";
import { Movie } from "@/components/types/movie";
import { addFavorite, removeFavorite, API_URL } from "@/lib/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const POSTER_FALLBACK_URL =
  "https://placehold.co/500x750/1b1d1f/ffffff?text=No+Poster";

export default function MovieDetails() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const { movies, toggleFavorite, deleteMovie } = useMovies();
  const { getAccessToken } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(
    movies.find((m) => m.id === movieId) ?? null,
  );
  const [isLoading, setIsLoading] = useState(!movie);

  const fetchMovie = useCallback(async () => {
    if (movie) return;

    try {
      const response = await fetch(`${API_URL}/api/movies/${movieId}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      setMovie({
        id: String(data.id),
        title: data.title ?? "Untitled",
        director: data.director ?? "Unknown director",
        release_date: data.release_date?.slice(0, 4) || "Unknown",
        score:
          typeof data.vote_average === "number"
            ? Number(data.vote_average.toFixed(1))
            : 0,
        favorite: false,
        poster: data.poster_path
          ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}`
          : POSTER_FALLBACK_URL,
        desc: data.overview || "No description available.",
      });
    } catch {
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [movie, movieId, router]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

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
        onDelete={(id) =>
          Alert.alert(
            "Deleting",
            "Are you sure you want to delete this movie?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "OK",
                onPress: () => {
                  deleteMovie(id);
                  router.back();
                },
              },
            ],
          )
        }
        onToggleFavorite={handleToggleFavorite}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}
