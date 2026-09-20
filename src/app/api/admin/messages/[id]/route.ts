import { NextResponse } from "next/server";
import { deleteMessageById } from "@/lib/messages";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Không tìm thấy lưu bút." }, { status: 404 });
  }

  await deleteMessageById(id);

  return NextResponse.json({ ok: true });
}
