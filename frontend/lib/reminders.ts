import { MovieReminder } from "@/components/types/MovieReminder";
import { apiRequest } from "./client";

export function toLocalISOString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export async function getReminders(
  access_token: string,
): Promise<MovieReminder[]> {
  return apiRequest<MovieReminder[]>("/api/reminders", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
}

export async function getUpcomingReminders(
  access_token: string,
): Promise<MovieReminder[]> {
  return apiRequest<MovieReminder[]>("/api/reminders/upcoming", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
}

export async function createReminder(
  tmdb_id: number,
  remind_at: Date,
  note: string | null,
  access_token: string,
): Promise<MovieReminder> {
  return apiRequest<MovieReminder>("/api/reminders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      tmdb_id,
      remind_at: toLocalISOString(remind_at),
      note,
    }),
  });
}

export async function updateReminder(
  reminder_id: number,
  remind_at: Date | null,
  note: string | null,
  access_token: string,
): Promise<MovieReminder> {
  return apiRequest<MovieReminder>(`/api/reminders/${reminder_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      remind_at: remind_at ? toLocalISOString(remind_at) : null,
      note,
    }),
  });
}

export async function deleteReminder(
  reminder_id: number,
  access_token: string,
): Promise<MovieReminder> {
  return apiRequest<MovieReminder>(`/api/reminders/${reminder_id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access_token}` },
  });
}
