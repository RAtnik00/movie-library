import { useAuth } from "@/context/auth-context";
import { deleteReminder, getReminders, updateReminder } from "@/lib/api";
import { MovieReminder } from "@/components/types/MovieReminder";
import ReminderModal from "@/components/reminder-modal";
import ReminderCalendar from "@/components/reminder-calendar";
import ReminderList from "@/components/reminder-list";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RemindersScreen() {
  const { getAccessToken } = useAuth();

  const [reminders, setReminders] = useState<MovieReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingReminder, setEditingReminder] = useState<MovieReminder | null>(
    null,
  );

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const token = await getAccessToken();
        if (!token) return;
        try {
          setIsLoading(true);
          const data = await getReminders(token);
          setReminders(data);
        } finally {
          setIsLoading(false);
        }
      };
      load();
    }, []),
  );

  const handleDelete = async (id: number) => {
    const token = await getAccessToken();
    if (!token) return;
    await deleteReminder(id, token);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdate = async (date: Date, note: string | null) => {
    if (!editingReminder) return;
    const token = await getAccessToken();
    if (!token) return;
    const updated = await updateReminder(editingReminder.id, date, note, token);
    setReminders((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r)),
    );
    setEditingReminder(null);
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReminderCalendar
        reminders={reminders}
        month={calMonth}
        year={calYear}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      <ReminderList
        reminders={reminders}
        isLoading={isLoading}
        onEdit={setEditingReminder}
        onDelete={handleDelete}
      />

      {editingReminder && (
        <ReminderModal
          visible={!!editingReminder}
          initialDate={new Date(editingReminder.remind_at)}
          initialNote={editingReminder.note ?? ""}
          onConfirm={handleUpdate}
          onClose={() => setEditingReminder(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b1d1f", paddingTop: 20 },
});
