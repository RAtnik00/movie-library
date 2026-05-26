import {
  loginUser,
  logoutUser,
  registerUser,
  AuthTokens,
  UserProfile,
  getMe,
} from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType } from "./context-types/auth-context-type";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const getAccessToken = async () => AsyncStorage.getItem("access_token");

  useEffect(() => {
    const resumeSession = async () => {
      try {
        const access_token = await AsyncStorage.getItem("access_token");
        if (access_token) {
          const profile = await getMe(access_token);
          setUser(profile);
        }
      } catch {
        await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
      } finally {
        setIsLoading(false);
      }
    };

    resumeSession();
  }, []);

  const login = async (username: string, password: string) => {
    const tokens: AuthTokens = await loginUser(username, password);
    await AsyncStorage.setItem("access_token", tokens.access_token);
    await AsyncStorage.setItem("refresh_token", tokens.refresh_token);
    const profile = await getMe(tokens.access_token);
    setUser(profile);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    birthDate: string,
  ) => {
    await registerUser(username, email, password, birthDate);
    await login(username, password);
  };

  const logout = async () => {
    try {
      const refresh_token = await AsyncStorage.getItem("refresh_token");
      if (refresh_token) await logoutUser(refresh_token);
    } finally {
      await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        register,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
