import { AuthProvider, useAuth } from "@/context/auth-context";
import { MoviesProvider } from "@/context/movie-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={isLoggedIn ? "(tabs)" : "login"}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", headerShown: true, title: "Modal" }}
      />
      <Stack.Screen name="explore/[movieId]" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <MoviesProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <RootNavigator />
          <StatusBar />
        </ThemeProvider>
      </MoviesProvider>
    </AuthProvider>
  );
}
