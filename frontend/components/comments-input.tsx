import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

interface Props {
  onSubmit: (text: string) => Promise<void>;
}

export default function CommentInput({ onSubmit }: Props) {
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      setIsPosting(true);
      await onSubmit(trimmed);
      setText("");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        placeholderTextColor="#666"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Pressable
        style={[styles.btn, (!text.trim() || isPosting) && styles.disabled]}
        onPress={handleSubmit}
        disabled={!text.trim() || isPosting}
      >
        {isPosting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="send" size={18} color="white" />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2d2f",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
    maxHeight: 100,
  },
  btn: {
    backgroundColor: "#11b74e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
});
