import { getSupabase } from "@/lib/supabase";

export type GuestEntry = {
  name: string;
  displayName: string;
  salutation: string;
  selfRef: string;
  active: boolean;
};

export type Guest = GuestEntry & { slug: string };

export const genericGuest: Guest = {
  slug: "",
  name: "",
  displayName: "Bạn",
  salutation: "Bạn",
  selfRef: "mình",
  active: true,
};

type GuestRow = {
  name: string;
  display_name: string;
  salutation: string;
  self_ref: string;
  active: boolean;
};

/**
 * Slug is a guest's 1-based position among rows ordered by `id`, not a
 * stored field — so a new guest just gets appended, no numbering by hand.
 * writeGuests replaces the whole table so the array order it's given always
 * becomes the new `id` order. Never reorder or delete existing entries, or
 * everyone's link after that point shifts; set "active": false to retire a
 * guest instead.
 */
export async function readGuests(): Promise<GuestEntry[]> {
  const { data, error } = await getSupabase()
    .from("guests")
    .select("name, display_name, salutation, self_ref, active")
    .order("id", { ascending: true });
  if (error) throw error;

  return (data as GuestRow[]).map((row) => ({
    name: row.name,
    displayName: row.display_name,
    salutation: row.salutation,
    selfRef: row.self_ref,
    active: row.active,
  }));
}

export async function writeGuests(guests: GuestEntry[]): Promise<void> {
  const supabase = getSupabase();

  const { error: deleteError } = await supabase.from("guests").delete().gte("id", 0);
  if (deleteError) throw deleteError;

  if (guests.length === 0) return;

  const { error: insertError } = await supabase.from("guests").insert(
    guests.map((guest) => ({
      name: guest.name,
      display_name: guest.displayName,
      salutation: guest.salutation,
      self_ref: guest.selfRef,
      active: guest.active,
    }))
  );
  if (insertError) throw insertError;
}

export async function getGuestBySlug(slug: string): Promise<Guest> {
  const index = Number(slug);
  if (!Number.isInteger(index) || index < 1) return genericGuest;

  const entry = (await readGuests())[index - 1];
  if (!entry || !entry.active) return genericGuest;

  return { ...entry, slug: String(index) };
}

export async function getAllGuestsWithSlugs(): Promise<Guest[]> {
  const guests = await readGuests();
  return guests.map((guest, i) => ({ ...guest, slug: String(i + 1) }));
}
