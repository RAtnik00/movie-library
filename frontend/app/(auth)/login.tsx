import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await login(username.trim(), password);

      router.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Movie Library</Text>
      </View>

      <TextInput
        value={username}
        onChangeText={(t) => {
          setUsername(t);
          setError(null);
        }}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#b5a5a5"
        autoCapitalize="none"
      />

      <TextInput
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setError(null);
        }}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#b5a5a5"
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        onPress={handleLogin}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.push("/register")}
        style={({ pressed }) => [
          styles.registerLink,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.registerLinkText}>
          Don`t have an account{" "}
          <Text style={styles.registerLinkHighlight}>Register</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#1b1d1f",
  },

  header: {
    alignItems: "center",
    marginBottom: 40,
  },

  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#26282b",
    color: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#33373b",
  },

  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    marginBottom: 12,
    paddingLeft: 4,
  },

  button: {
    backgroundColor: "#11b74e",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonPressed: {
    opacity: 0.85,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  registerLink: {
    marginTop: 22,
    alignItems: "center",
  },

  registerLinkText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  registerLinkHighlight: {
    color: "#11b74e",
    fontWeight: "700",
  },
});
