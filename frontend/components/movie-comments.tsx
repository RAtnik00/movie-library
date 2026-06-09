import CommentInput from "./comments-input";
import { useAuth } from "@/context/auth-context";
import {
  createComment,
  deleteComment,
  getMovieComments,
  updateComment,
} from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MovieComment } from "./types/MovieComment";

interface Props {
  tmdbId: number;
  movieTitle?: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MovieComments({ tmdbId, movieTitle }: Props) {
  const { user, getAccessToken } = useAuth();

  const [comments, setComments] = useState<MovieComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    getMovieComments(tmdbId)
      .then(setComments)
      .finally(() => setIsLoading(false));
  }, [tmdbId]);

  const handlePost = async (text: string) => {
    const token = await getAccessToken();
    if (!token) return;
    const comment = await createComment(tmdbId, text, token);
    setComments((prev) => [comment, ...prev]);
  };

  const handleDelete = async (commentId: number) => {
    const token = await getAccessToken();
    if (!token) return;
    await deleteComment(commentId, token);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleEdit = async (commentId: number) => {
    const text = editText.trim();
    if (!text) return;
    const token = await getAccessToken();
    if (!token) return;
    const updated = await updateComment(commentId, text, token);
    setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
    setEditingId(null);
    setEditText("");
  };

  return (
    <View>
      {movieTitle && <Text style={styles.movieTitle}>{movieTitle}</Text>}
      <Text style={styles.sectionTitle}>Comments</Text>

      {user && <CommentInput onSubmit={handlePost} />}

      {isLoading ? (
        <ActivityIndicator color="#f1f1f1" style={styles.loader} />
      ) : comments.length === 0 ? (
        <Text style={styles.empty}>No comments yet.</Text>
      ) : (
        comments.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.username}>{c.user.username}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.date}>{formatDate(c.created_at)}</Text>
                {user?.id === c.user_id && (
                  <View style={styles.actions}>
                    <Pressable
                      hitSlop={8}
                      onPress={() => {
                        setEditingId(c.id);
                        setEditText(c.text);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={14} color="#aaa" />
                    </Pressable>
                    <Pressable hitSlop={8} onPress={() => handleDelete(c.id)}>
                      <Ionicons name="trash-outline" size={14} color="#aaa" />
                    </Pressable>
                  </View>
                )}
              </View>
            </View>

            {editingId === c.id ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={editText}
                  onChangeText={setEditText}
                  multiline
                  autoFocus
                  placeholderTextColor="#aaa"
                />
                <View style={styles.editButtons}>
                  <Pressable
                    onPress={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    style={styles.cancelBtn}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleEdit(c.id)}
                    style={[
                      styles.saveBtn,
                      !editText.trim() && styles.disabled,
                    ]}
                    disabled={!editText.trim()}
                  >
                    <Text style={styles.saveText}>Save</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text style={styles.commentText}>{c.text}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  movieTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 2,
  },
  sectionTitle: {
    color: "#f1f1f1",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  loader: { marginVertical: 16 },
  empty: {
    color: "#888",
    fontSize: 14,
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#2a2d2f",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    color: "#11b74e",
    fontWeight: "700",
    fontSize: 13,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  date: {
    color: "#aaa",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  commentText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
  editRow: {
    gap: 8,
  },
  editInput: {
    backgroundColor: "#1b1d1f",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#f1f1f1",
    fontSize: 14,
    maxHeight: 100,
  },
  editButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#3a3d42",
  },
  cancelText: {
    color: "#aaa",
    fontSize: 13,
  },
  saveBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#11b74e",
  },
  saveText: {
    color: "#f1f1f1",
    fontSize: 13,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.4,
  },
});
