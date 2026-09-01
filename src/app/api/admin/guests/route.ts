import { NextResponse } from "next/server";
import { readGuests, writeGuests } from "@/lib/guests";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const salutation = typeof body?.salutation === "string" ? body.salutation.trim() : "";
  const selfRef = typeof body?.selfRef === "string" ? body.selfRef.trim() : "";

  if (!name || !displayName) {
    return NextResponse.json({ error: "Thiếu tên đầy đủ hoặc tên hiển thị." }, { status: 400 });
  }

  const guests = await readGuests();
  guests.push({
    name,
    displayName,
    salutation: salutation || "Bạn",
    selfRef: selfRef || "mình",
    active: true,
  });
  await writeGuests(guests);

  return NextResponse.json({ ok: true, slug: String(guests.length) });
}
