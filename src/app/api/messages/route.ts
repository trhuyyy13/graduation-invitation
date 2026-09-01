import { NextResponse } from "next/server";
import { readMessages, writeMessages } from "@/lib/messages";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const message = typeof body?.message === "string" ? body.message.trim().slice(0, 2000) : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 100) : "";
  const slug = typeof body?.slug === "string" ? body.slug.slice(0, 20) : "";

  if (!message) {
    return NextResponse.json({ error: "Thiếu nội dung lời nhắn." }, { status: 400 });
  }

  const messages = await readMessages();
  messages.push({
    slug,
    name: name || "Ẩn danh",
    message,
    submittedAt: new Date().toISOString(),
  });
  await writeMessages(messages);

  return NextResponse.json({ ok: true });
}
