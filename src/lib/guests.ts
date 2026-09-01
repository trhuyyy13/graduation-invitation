import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";

const GUESTS_FILE = path.join(process.cwd(), "src/data/guests.json");

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

function parseGuests(raw: string): GuestEntry[] {
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

function readGuestsSync(): GuestEntry[] {
  try {
    return parseGuests(fs.readFileSync(GUESTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function readGuests(): Promise<GuestEntry[]> {
  try {
    return parseGuests(await fsp.readFile(GUESTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function writeGuests(guests: GuestEntry[]): Promise<void> {
  await fsp.writeFile(GUESTS_FILE, JSON.stringify(guests, null, 2) + "\n", "utf-8");
}

/**
 * Slug is a guest's 1-based position in data/guests.json, not a stored
 * field — so a new guest just gets appended to the file, no numbering by hand.
 * Never reorder or delete existing rows, or everyone's link after that point
 * shifts; set "active": false to retire a guest instead.
 */
export function getGuestBySlug(slug: string): Guest {
  const index = Number(slug);
  if (!Number.isInteger(index) || index < 1) return genericGuest;

  const entry = readGuestsSync()[index - 1];
  if (!entry || !entry.active) return genericGuest;

  return { ...entry, slug: String(index) };
}

export function getAllGuestSlugs(): string[] {
  return readGuestsSync()
    .map((guest, i) => (guest.active ? String(i + 1) : null))
    .filter((slug): slug is string => slug !== null);
}

export function getAllGuestsWithSlugs(): Guest[] {
  return readGuestsSync().map((guest, i) => ({ ...guest, slug: String(i + 1) }));
}
