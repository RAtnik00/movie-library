import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./api";
import { BASE_URL } from "./config";

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type RegisterResponse = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

// Login — note the backend uses OAuth2PasswordRequestForm,
// so we must send form-urlencoded, NOT JSON
export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }).toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  const data: LoginResponse = await response.json();

  // Persist tokens
  await AsyncStorage.setItem("access_token", data.access_token);
  await AsyncStorage.setItem("refresh_token", data.refresh_token);

  return data;
}

export async function register(
  username: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  return api.post("/auth/register", { username, email, password });
}

export async function logout() {
  const refresh_token = await AsyncStorage.getItem("refresh_token");
  if (refresh_token) {
    await api.post("/auth/logout", { refresh_token });
  }
  await AsyncStorage.removeItem("access_token");
  await AsyncStorage.removeItem("refresh_token");
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh_token = await AsyncStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  await AsyncStorage.setItem("access_token", data.access_token);
  return data.access_token;
}
