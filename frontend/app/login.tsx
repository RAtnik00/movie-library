// app/login.tsx
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";

export default function VerstkaLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (username === "" && password === "") {
      login();
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", "Invalid username or password");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ9Db5WtT-GdWS_C4be_YNL_Oc9FCbWL6tVw&s",
          }}
          style={{ width: 200, height: 200, borderRadius: 100 }}
        />
        <Text style={{ color: "white", fontSize: 24, marginTop: 10 }}>
          Super_Cutie
        </Text>
      </View>

      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{
          backgroundColor: "#222020",
          color: "white",
          padding: 10,
          borderRadius: 5,
          marginBottom: 15,
        }}
        placeholder="Username"
        placeholderTextColor="#b5a5a5"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: "#222020",
          color: "white",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        placeholder="Password"
        placeholderTextColor="#b5a5a5"
        secureTextEntry
      />

      <Pressable
        onPress={handleLogin}
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
      </Pressable>
    </View>
  );
}
