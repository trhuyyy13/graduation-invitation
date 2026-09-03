import { NextResponse } from "next/server";
import { getAllGuestsWithSlugs } from "@/lib/guests";
import { readMessages } from "@/lib/messages";

export async function GET() {
  const guests = await getAllGuestsWithSlugs();
  const messages = (await readMessages())
    .map((message, index) => ({ ...message, index }))
    .reverse();

  return NextResponse.json({ guests, messages });
}
