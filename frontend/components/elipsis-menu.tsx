import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onToggleWatchlist: () => void;
  onSetReminder: () => void;
  isWatchlisted: boolean;
}

export default function EllipsisMenu({
  visible,
  onClose,
  onToggleWatchlist,
  onSetReminder,
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
              onToggleWatchlist();
              onClose();
            }}
          >
            <Text style={styles.text}>
              {isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.item, styles.borderedItem]}
            onPress={() => {
              onSetReminder();
              onClose();
            }}
          >
            <Text style={styles.text}>Set reminder</Text>
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
