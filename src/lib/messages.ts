import { getSupabase } from "@/lib/supabase";
import type { AttendanceStatus } from "@/lib/attendance";

export type StoredMessage = {
  id: number;
  slug: string;
  name: string;
  message: string;
  attendance: AttendanceStatus | null;
  submittedAt: string;
};

type MessageRow = {
  id: number;
  slug: string | null;
  name: string;
  message: string;
  attendance: AttendanceStatus | null;
  submitted_at: string;
};

export async function readMessages(): Promise<StoredMessage[]> {
  const { data, error } = await getSupabase()
    .from("messages")
    .select("id, slug, name, message, attendance, submitted_at")
    .order("id", { ascending: true });
  if (error) throw error;

  return (data as MessageRow[]).map((row) => ({
    id: row.id,
    slug: row.slug ?? "",
    name: row.name,
    message: row.message,
    attendance: row.attendance,
    submittedAt: row.submitted_at,
  }));
}

export async function addMessage(
  message: Omit<StoredMessage, "id">
): Promise<void> {
  const { error } = await getSupabase()
    .from("messages")
    .insert({
      slug: message.slug,
      name: message.name,
      message: message.message,
      attendance: message.attendance,
      submitted_at: message.submittedAt,
    });
  if (error) throw error;
}

export async function deleteMessageById(id: number): Promise<void> {
  const { error } = await getSupabase().from("messages").delete().eq("id", id);
  if (error) throw error;
}
