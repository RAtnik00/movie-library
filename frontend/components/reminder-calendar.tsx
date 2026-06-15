import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MovieReminder } from "@/components/types/MovieReminder";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

interface Props {
  reminders: MovieReminder[];
  month: number;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function ReminderCalendar({
  reminders,
  month,
  year,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const today = new Date();

  const reminderDays = new Set(
    reminders
      .map((r) => {
        const d = new Date(r.remind_at);
        return d.getFullYear() === year && d.getMonth() === month
          ? d.getDate()
          : null;
      })
      .filter(Boolean),
  );

  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const calCells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1,
  );

  return (
    <View style={styles.calendar}>
      <View style={styles.calHeader}>
        <Pressable onPress={onPrevMonth} hitSlop={8}>
          <Ionicons name="chevron-back" size={20} color="white" />
        </Pressable>
        <Text style={styles.calTitle}>
          {MONTHS[month]} {year}
        </Text>
        <Pressable onPress={onNextMonth} hitSlop={8}>
          <Ionicons name="chevron-forward" size={20} color="white" />
        </Pressable>
      </View>

      <View style={styles.calRow}>
        {DAYS.map((d) => (
          <Text key={d} style={styles.calDayLabel}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.calGrid}>
        {calCells.map((day, i) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasReminder = day !== null && reminderDays.has(day);

          return (
            <View key={i} style={styles.calCell}>
              {day !== null && (
                <>
                  <View
                    style={[styles.calDayCircle, isToday && styles.calDayToday]}
                  >
                    <Text
                      style={[
                        styles.calDayText,
                        isToday && styles.calDayTextToday,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                  {hasReminder && <View style={styles.dot} />}
                </>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendar: {
    backgroundColor: "#25282b",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  calHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  calTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  calRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  calDayLabel: {
    flex: 1,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  calGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calCell: {
    width: "14%",
    alignItems: "center",
    paddingVertical: 4,
  },
  calDayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  calDayToday: {
    backgroundColor: "#11b74e",
  },
  calDayText: {
    color: "#f1f1f1",
    fontSize: 13,
  },
  calDayTextToday: {
    color: "white",
    fontWeight: "700",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#11b74e",
    marginTop: 2,
  },
});
