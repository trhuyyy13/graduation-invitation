import { NextResponse } from "next/server";
import { readMessages, writeMessages } from "@/lib/messages";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ index: string }> }
) {
  const { index } = await params;
  const i = Number(index);

  const messages = await readMessages();
  if (!Number.isInteger(i) || i < 0 || i >= messages.length) {
    return NextResponse.json({ error: "Không tìm thấy lời nhắn." }, { status: 404 });
  }

  messages.splice(i, 1);
  await writeMessages(messages);

  return NextResponse.json({ ok: true });
}
