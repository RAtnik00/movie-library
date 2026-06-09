import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name="search"
        size={18}
        color="#b5a5a5"
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder="Your movie"
        placeholderTextColor="#b5a5a5"
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChange("")} hitSlop={8}>
          <Ionicons name="close-circle-outline" size={18} color="#b5a5a5" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  input: {
    color: "#fff",
    flex: 1,
  },
  inputIcon: {
    marginRight: 6,
  },
});
