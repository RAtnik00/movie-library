import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  initialDate?: Date;
  initialNote?: string;
  onConfirm: (date: Date, note: string | null) => void;
  onClose: () => void;
}

export default function ReminderModal({
  visible,
  initialDate,
  initialNote,
  onConfirm,
  onClose,
}: Props) {
  const [date, setDate] = useState<Date>(initialDate ?? new Date());
  const [note, setNote] = useState(initialNote ?? "");
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setDate(initialDate ?? new Date());
      setNote(initialNote ?? "");
      setShowPicker(false);
    }
  }, [visible]);

  const handleConfirm = () => {
    onConfirm(date, note.trim() || null);
    onClose();
  };

  return (
    <Modal transparent visible={visible}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.row}>
              <Pressable onPress={onClose}>
                <Text style={styles.cancel}>Cancel</Text>
              </Pressable>
              <Text style={styles.title}>Set Reminder</Text>
              <Pressable onPress={handleConfirm}>
                <Text style={styles.done}>Done</Text>
              </Pressable>
            </View>

            {/* Date / Time triggers */}
            <View style={styles.row}>
              <Pressable
                style={styles.segment}
                onPress={() => {
                  setPickerMode("date");
                  setShowPicker(true);
                }}
              >
                <Text style={styles.segmentLabel}>DATE</Text>
                <Text style={styles.segmentValue}>
                  {date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Pressable>

              <Pressable
                style={styles.segment}
                onPress={() => {
                  setPickerMode("time");
                  setShowPicker(true);
                }}
              >
                <Text style={styles.segmentLabel}>TIME</Text>
                <Text style={styles.segmentValue}>
                  {date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </Text>
              </Pressable>
            </View>

            {/* Picker */}
            {showPicker && (
              <DateTimePicker
                value={date}
                mode={pickerMode}
                display="spinner"
                minimumDate={pickerMode === "date" ? new Date() : undefined}
                textColor="#f1f1f1"
                onChange={(_, d) => {
                  setShowPicker(false);
                  if (d) setDate(d);
                }}
              />
            )}

            {/* Note */}
            <TextInput
              style={styles.note}
              placeholder="Add a note (optional)"
              placeholderTextColor="#7d7a7a"
              value={note}
              onChangeText={setNote}
              multiline
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#1b1d1f93",
  },
  sheet: {
    backgroundColor: "#25282b",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  sheetContent: {
    paddingBottom: 30,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#323539",
  },
  title: {
    color: "#f1f1f1",
    fontSize: 15,
    fontWeight: "600",
  },
  cancel: {
    color: "#9ca3af",
    fontSize: 15,
  },
  done: {
    color: "#11b74e",
    fontSize: 15,
    fontWeight: "700",
  },
  segment: {
    flex: 1,
    backgroundColor: "#323539",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    gap: 2,
  },
  segmentLabel: {
    color: "#9ca3af",
    fontSize: 11,
  },
  segmentValue: {
    color: "#f1f1f1",
    fontSize: 14,
    fontWeight: "500",
  },
  note: {
    backgroundColor: "#323539",
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#f1f1f1",
    fontSize: 14,
    maxHeight: 80,
  },
});