import { NextResponse } from "next/server";
import { createGuest, isReservedSlug, slugify } from "@/lib/guests";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const salutation = typeof body?.salutation === "string" ? body.salutation.trim() : "";
  const selfRef = typeof body?.selfRef === "string" ? body.selfRef.trim() : "";
  const slugInput = typeof body?.slug === "string" ? body.slug : "";
  const slug = slugify(slugInput || displayName || name);

  if (!name || !displayName) {
    return NextResponse.json({ error: "Thiếu tên đầy đủ hoặc tên hiển thị." }, { status: 400 });
  }
  if (!slug || isReservedSlug(slug)) {
    return NextResponse.json({ error: "Đường link (slug) không hợp lệ." }, { status: 400 });
  }

  try {
    const guest = await createGuest({
      slug,
      name,
      displayName,
      salutation: salutation || "Bạn",
      selfRef: selfRef || "mình",
    });
    return NextResponse.json({ ok: true, slug: guest.slug });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("guests_slug_unique") || message.includes("duplicate key")) {
      return NextResponse.json(
        { error: "Đường link này đã được dùng cho khách khác." },
        { status: 409 }
      );
    }
    throw error;
  }
}
