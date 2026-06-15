import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#19191e",
          borderTopColor: "#2a2a2a",
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: "Lists",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminder"
        options={{
          title: "Reminders",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
