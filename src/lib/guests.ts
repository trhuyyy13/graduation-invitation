import { getSupabase } from "@/lib/supabase";

export type GuestEntry = {
  id: number;
  slug: string;
  name: string;
  displayName: string;
  salutation: string;
  selfRef: string;
  active: boolean;
};

export type Guest = GuestEntry;

export const genericGuest: Guest = {
  id: 0,
  slug: "",
  name: "",
  displayName: "Bạn",
  salutation: "Bạn",
  selfRef: "mình",
  active: true,
};

const RESERVED_SLUGS = new Set(["admin", "api", "loi-nhan", "xem-loi-moi"]);

/** Trims/lowercases/dash-ifies whatever the admin types, so "Đức Anh" or
 * "  duc anh " both become a clean, URL-safe slug like "duc-anh". */
export function slugify(input: string): string {
  return input
    .replace(/đ/gi, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug);
}

type GuestRow = {
  id: number;
  slug: string;
  name: string;
  display_name: string;
  salutation: string;
  self_ref: string;
  active: boolean;
};

function fromRow(row: GuestRow): GuestEntry {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    displayName: row.display_name,
    salutation: row.salutation,
    selfRef: row.self_ref,
    active: row.active,
  };
}

const GUEST_COLUMNS = "id, slug, name, display_name, salutation, self_ref, active";

export async function readGuests(): Promise<GuestEntry[]> {
  const { data, error } = await getSupabase()
    .from("guests")
    .select(GUEST_COLUMNS)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data as GuestRow[]).map(fromRow);
}

export async function getGuestBySlug(slug: string): Promise<Guest> {
  if (!slug) return genericGuest;

  const { data, error } = await getSupabase()
    .from("guests")
    .select(GUEST_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data || !(data as GuestRow).active) return genericGuest;

  return fromRow(data as GuestRow);
}

export type NewGuestInput = {
  slug: string;
  name: string;
  displayName: string;
  salutation: string;
  selfRef: string;
};

export async function createGuest(input: NewGuestInput): Promise<GuestEntry> {
  const { data, error } = await getSupabase()
    .from("guests")
    .insert({
      slug: input.slug,
      name: input.name,
      display_name: input.displayName,
      salutation: input.salutation,
      self_ref: input.selfRef,
      active: true,
    })
    .select(GUEST_COLUMNS)
    .single();
  if (error) throw error;
  return fromRow(data as GuestRow);
}

export type GuestPatch = Partial<{
  slug: string;
  name: string;
  displayName: string;
  salutation: string;
  selfRef: string;
  active: boolean;
}>;

export async function updateGuestById(id: number, patch: GuestPatch): Promise<void> {
  const row: Record<string, unknown> = {};
  if (patch.slug !== undefined) row.slug = patch.slug;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.displayName !== undefined) row.display_name = patch.displayName;
  if (patch.salutation !== undefined) row.salutation = patch.salutation;
  if (patch.selfRef !== undefined) row.self_ref = patch.selfRef;
  if (patch.active !== undefined) row.active = patch.active;

  const { error } = await getSupabase().from("guests").update(row).eq("id", id);
  if (error) throw error;
}
