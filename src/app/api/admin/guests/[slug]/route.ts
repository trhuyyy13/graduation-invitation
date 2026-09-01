import { NextResponse } from "next/server";
import { readGuests, writeGuests } from "@/lib/guests";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const index = Number(slug) - 1;

  const guests = await readGuests();
  const current = guests[index];
  if (!Number.isInteger(index) || !current) {
    return NextResponse.json({ error: "Không tìm thấy khách mời." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  guests[index] = {
    name: typeof body?.name === "string" ? body.name.trim() : current.name,
    displayName:
      typeof body?.displayName === "string" ? body.displayName.trim() : current.displayName,
    salutation:
      typeof body?.salutation === "string" ? body.salutation.trim() : current.salutation,
    selfRef: typeof body?.selfRef === "string" ? body.selfRef.trim() : current.selfRef,
    active: typeof body?.active === "boolean" ? body.active : current.active,
  };

  await writeGuests(guests);
  return NextResponse.json({ ok: true });
}
