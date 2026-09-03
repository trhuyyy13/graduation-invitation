import { getSupabase } from "@/lib/supabase";

export type StoredMessage = {
  slug: string;
  name: string;
  message: string;
  submittedAt: string;
};

type MessageRow = {
  slug: string | null;
  name: string;
  message: string;
  submitted_at: string;
};

/**
 * Ordered by `id` (insertion order), matching the array index the admin
 * delete route expects. writeMessages replaces the whole table so the array
 * order it's given always becomes the new `id` order.
 */
export async function readMessages(): Promise<StoredMessage[]> {
  const { data, error } = await getSupabase()
    .from("messages")
    .select("slug, name, message, submitted_at")
    .order("id", { ascending: true });
  if (error) throw error;

  return (data as MessageRow[]).map((row) => ({
    slug: row.slug ?? "",
    name: row.name,
    message: row.message,
    submittedAt: row.submitted_at,
  }));
}

export async function writeMessages(messages: StoredMessage[]): Promise<void> {
  const supabase = getSupabase();

  const { error: deleteError } = await supabase.from("messages").delete().gte("id", 0);
  if (deleteError) throw deleteError;

  if (messages.length === 0) return;

  const { error: insertError } = await supabase.from("messages").insert(
    messages.map((message) => ({
      slug: message.slug,
      name: message.name,
      message: message.message,
      submitted_at: message.submittedAt,
    }))
  );
  if (insertError) throw insertError;
}
