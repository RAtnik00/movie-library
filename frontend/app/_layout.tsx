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
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

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

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1b1d1f" },
        animation: "none",
      }}
      initialRouteName={isLoggedIn ? "(tabs)" : "(auth)/login"}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="explore/[movieId]" options={{ animation: "none" }} />
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
