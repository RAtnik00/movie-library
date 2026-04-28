import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "./config";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await AsyncStorage.getItem("auth_token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Something went wrong");
  }

  return response.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: object) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
  patch: <T>(url: string, body: object) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
};
