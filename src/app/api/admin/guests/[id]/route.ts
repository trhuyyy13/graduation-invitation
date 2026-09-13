import { NextResponse } from "next/server";
import { isReservedSlug, slugify, updateGuestById } from "@/lib/guests";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Không tìm thấy khách mời." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);

  const patch: Parameters<typeof updateGuestById>[1] = {};
  if (typeof body?.name === "string") patch.name = body.name.trim();
  if (typeof body?.displayName === "string") patch.displayName = body.displayName.trim();
  if (typeof body?.salutation === "string") patch.salutation = body.salutation.trim();
  if (typeof body?.selfRef === "string") patch.selfRef = body.selfRef.trim();
  if (typeof body?.active === "boolean") patch.active = body.active;
  if (typeof body?.slug === "string") {
    const slug = slugify(body.slug);
    if (!slug || isReservedSlug(slug)) {
      return NextResponse.json({ error: "Đường link (slug) không hợp lệ." }, { status: 400 });
    }
    patch.slug = slug;
  }

  try {
    await updateGuestById(id, patch);
    return NextResponse.json({ ok: true });
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
