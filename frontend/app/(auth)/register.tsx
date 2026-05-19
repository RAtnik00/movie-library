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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await register(username.trim(), email.trim(), password);

      router.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>Register to continue using the app</Text>
      </View>

      <TextInput
        value={username}
        onChangeText={(t) => {
          setUsername(t);
          setError(null);
        }}
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
      />

      <TextInput
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setError(null);
        }}
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setError(null);
        }}
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        secureTextEntry
      />

      <TextInput
        value={confirmPassword}
        onChangeText={(t) => {
          setConfirmPassword(t);
          setError(null);
        }}
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        onPress={handleRegister}
        disabled={isLoading}
        style={[styles.registerButton]}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.registerButtonText}>Register</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(auth)/login")}
        style={styles.signLink}
      >
        <Text style={styles.signLinkText}>
          Already have an account?{" "}
          <Text style={styles.signLinkLink}>Sign in</Text>
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
    backgroundColor: "#1e1f21",
  },

  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: "#9ca3af",
    fontSize: 14,
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
    marginBottom: 14,
    fontSize: 13,
    paddingLeft: 4,
  },

  registerButton: {
    backgroundColor: "#11b74e",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  signLink: {
    alignItems: "center",
    marginTop: 24,
  },

  signLinkText: {
    color: "#9ca3af",
    fontSize: 14,
  },

  signLinkLink: {
    color: "#11b74e",
    fontWeight: "700",
  },
});
