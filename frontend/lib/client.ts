import Constants from "expo-constants";
import { Platform } from "react-native";

function getExpoDevServerHost(): string | null {
  const constants = Constants as typeof Constants & {
    expoGoConfig?: { debuggerHost?: string | null } | null;
    expoConfig?: { hostUri?: string | null } | null;
    manifest?: { debuggerHost?: string | null; hostUri?: string | null } | null;
    manifest2?: { extra?: { expoClient?: { hostUri?: string | null } } } | null;
  };

  const hostCandidates = [
    constants.expoConfig?.hostUri,
    constants.expoGoConfig?.debuggerHost,
    constants.manifest2?.extra?.expoClient?.hostUri,
    constants.manifest?.debuggerHost,
    constants.manifest?.hostUri,
  ];

  for (const hostUri of hostCandidates) {
    const host = hostUri
      ?.replace(/^[a-z]+:\/\//i, "")
      .split("/")[0]
      .split(":")[0];
    if (host && !["localhost", "127.0.0.1", "::1"].includes(host)) {
      return host;
    }
  }
  return null;
}

function getDefaultApiUrl(): string {
  if (Platform.OS === "android") return "http://10.0.2.2:8000";
  const devServerHost = getExpoDevServerHost();
  return devServerHost
    ? `http://${devServerHost}:8000`
    : "http://localhost:8000";
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? getDefaultApiUrl();

if (process.env.NODE_ENV !== "production") {
  console.log(`[api] API_URL=${API_URL}`);
}

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const POSTER_FALLBACK_URL =
  "https://dummyimage.com/500x750/1b1d1f/ffffff&text=No+Poster";

const REQUEST_TIMEOUT_MS = 8000;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getNewToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const AsyncStorage = (
        await import("@react-native-async-storage/async-storage")
      ).default;
      const storedRefresh = await AsyncStorage.getItem("refresh_token");
      if (!storedRefresh) return null;

      const response = await fetchWithTimeout(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: storedRefresh }),
      });
      if (!response.ok) return null;

      const tokens = await response.json();
      await AsyncStorage.setItem("access_token", tokens.access_token);
      await AsyncStorage.setItem("refresh_token", tokens.refresh_token);
      return tokens.access_token;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetchWithTimeout(`${API_URL}${path}`, options);

  if (response.status === 401) {
    const newToken = await getNewToken();
    if (!newToken) throw new Error("Could not validate credentials");

    const retryOptions: RequestInit = {
      ...options,
      headers: { ...options?.headers, Authorization: `Bearer ${newToken}` },
    };

    const retryResponse = await fetchWithTimeout(
      `${API_URL}${path}`,
      retryOptions,
    );
    if (!retryResponse.ok) {
      const errorData = await retryResponse.json().catch(() => ({}));
      throw new Error(
        errorData.detail ?? `API request failed: ${retryResponse.status}`,
      );
    }
    return retryResponse.json();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail ?? `API request failed: ${response.status}`,
    );
  }

  return response.json();
}
