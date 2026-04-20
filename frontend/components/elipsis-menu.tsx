import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
  isFavorite: boolean;
}

export default function EllipsisMenu({
  visible,
  onClose,
  onToggleFavorite,
  onDelete,
  isFavorite,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          <Pressable
            style={styles.item}
            onPress={() => {
              onToggleFavorite();
              onClose();
            }}
          >
            <Text style={styles.text}>
              {isFavorite ? "Remove from favorites" : "Add to favorites"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.item, styles.deleteItem]}
            onPress={() => {
              onDelete();
              onClose();
            }}
          >
            <Text style={[styles.text, { color: "#ff4d4d" }]}>Delete</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000080",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 16,
  },
  menu: {
    width: 180,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    overflow: "hidden",
  },
  item: {
    padding: 12,
  },
  deleteItem: {
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});
