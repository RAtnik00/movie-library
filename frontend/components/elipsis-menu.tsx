import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onMarkWatched: () => void;
  onToggleWatchlist: () => void;
  isFavorite: boolean;
  isWatched: boolean;
  isWatchlisted: boolean;
}

export default function EllipsisMenu({
  visible,
  onClose,
  onToggleFavorite,
  onMarkWatched,
  onToggleWatchlist,
  isFavorite,
  isWatched,
  isWatchlisted,
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
            style={[styles.item, styles.borderedItem]}
            onPress={() => {
              onMarkWatched();
              onClose();
            }}
          >
            <Text style={styles.text}>
              {isWatched ? "Remove from watched" : "Add to watched"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.item, styles.borderedItem]}
            onPress={() => {
              onToggleWatchlist();
              onClose();
            }}
          >
            <Text style={styles.text}>
              {isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            </Text>
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
  borderedItem: {
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});
