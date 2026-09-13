import { NextResponse } from "next/server";
import { readGuests } from "@/lib/guests";
import { readMessages } from "@/lib/messages";
import { getEventSettings } from "@/lib/eventSettings";

export async function GET() {
  const guests = await readGuests();
  const messages = (await readMessages())
    .map((message, index) => ({ ...message, index }))
    .reverse();
  const eventSettings = await getEventSettings();

  return NextResponse.json({ guests, messages, eventSettings });
}
