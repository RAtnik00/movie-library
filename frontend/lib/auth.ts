import type { AuthTokens } from "@/components/types/AuthTokens";
import type { UserProfile } from "@/components/types/UserProfile";
import { apiRequest } from "./client";

export async function registerUser(
  username: string,
  email: string,
  password: string,
  birthDate: string,
): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, birth_date: birthDate }),
  });
}

export async function loginUser(
  username: string,
  password: string,
): Promise<AuthTokens> {
  const body = new URLSearchParams({ username, password });
  return apiRequest<AuthTokens>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

export async function logoutUser(refresh_token: string): Promise<void> {
  return apiRequest("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
}

export async function getMe(access_token: string): Promise<UserProfile> {
  return apiRequest<UserProfile>("/auth/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
}

export async function refreshToken(refresh_token: string): Promise<AuthTokens> {
  return apiRequest<AuthTokens>("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
}
