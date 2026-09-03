import { NextResponse } from "next/server";
import { updateEventSettings } from "@/lib/eventSettings";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);

  const date = typeof body?.date === "string" ? body.date.trim() : "";
  const startTime = typeof body?.startTime === "string" ? body.startTime.trim() : "";
  const endTime = typeof body?.endTime === "string" ? body.endTime.trim() : "";
  const venue = typeof body?.venue === "string" ? body.venue.trim() : "";
  const university = typeof body?.university === "string" ? body.university.trim() : "";
  const address = typeof body?.address === "string" ? body.address.trim() : "";
  const contactPhone = typeof body?.contactPhone === "string" ? body.contactPhone.trim() : "";

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !startTime ||
    !endTime ||
    !venue ||
    !university ||
    !address ||
    !contactPhone
  ) {
    return NextResponse.json({ error: "Thiếu hoặc sai định dạng thông tin." }, { status: 400 });
  }

  await updateEventSettings({
    date,
    startTime,
    endTime,
    venue,
    university,
    address,
    contactPhone,
  });

  return NextResponse.json({ ok: true });
}
