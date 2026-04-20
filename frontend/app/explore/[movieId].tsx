import MovieDetailsView from "@/components/movie-details-view";
import { useMovies } from "@/context/movie-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MovieDetails() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const { movies, toggleFavorite, deleteMovie } = useMovies();

  const movie = movies.find((m) => m.id === movieId);

  if (!movie) return null;

  const onDelete = (id: string) => {
    deleteMovie(id);
    router.back();
  };

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
        onToggleFavorite={toggleFavorite}
        onBack={() => router.back()}
      />
    </SafeAreaView>
  );
}
