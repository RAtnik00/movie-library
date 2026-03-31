import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function VerstkaLogin() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Image
          source={{
            uri: "https://i.guim.co.uk/img/media/327aa3f0c3b8e40ab03b4ae80319064e401c6fbc/377_133_3542_2834/master/3542.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=34d32522f47e4a67286f9894fc81c863",
          }}
          style={{ width: 200, height: 200, borderRadius: 100 }}
        />
        <Text style={{ color: "white", fontSize: 24, marginTop: 10 }}>
          Please Log in
        </Text>
      </View>

      <TextInput
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
        style={{
          backgroundColor: "#222020",
          color: "white",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        placeholder="Password"
        placeholderTextColor="#b5a5a5"
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
