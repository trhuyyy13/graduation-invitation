import { getSupabase } from "@/lib/supabase";
import { eventConfig } from "@/config/event";

export type EventSettingsInput = {
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  university: string;
  address: string;
  contactPhone: string;
};

export type EventSettings = EventSettingsInput & {
  weekdayLabel: string;
  day: string;
  month: string;
  yearLabel: string;
  mapUrl: string;
};

const WEEKDAY_LABELS = [
  "CHỦ NHẬT",
  "THỨ HAI",
  "THỨ BA",
  "THỨ TƯ",
  "THỨ NĂM",
  "THỨ SÁU",
  "THỨ BẢY",
];

const defaults: EventSettingsInput = {
  date: eventConfig.date,
  startTime: eventConfig.startTime,
  endTime: eventConfig.endTime,
  venue: eventConfig.venue,
  university: eventConfig.university,
  address: eventConfig.address,
  contactPhone: eventConfig.contactPhone,
};

function withDerivedFields(input: EventSettingsInput): EventSettings {
  const [year, month, day] = input.date.split("-");
  const weekday = WEEKDAY_LABELS[new Date(`${input.date}T00:00:00`).getDay()];
  const mapQuery = `${input.venue}, ${input.university}, ${input.address}`;

  return {
    ...input,
    day: day ?? "",
    month: month ?? "",
    yearLabel: year ?? "",
    weekdayLabel: weekday ?? "",
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
  };
}

type SettingsRow = {
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  university: string;
  address: string;
  contact_phone: string;
};

export async function getEventSettings(): Promise<EventSettings> {
  const { data, error } = await getSupabase()
    .from("event_settings")
    .select("date, start_time, end_time, venue, university, address, contact_phone")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return withDerivedFields(defaults);

  const row = data as SettingsRow;
  return withDerivedFields({
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    venue: row.venue,
    university: row.university,
    address: row.address,
    contactPhone: row.contact_phone,
  });
}

export async function updateEventSettings(input: EventSettingsInput): Promise<void> {
  const { error } = await getSupabase()
    .from("event_settings")
    .update({
      date: input.date,
      start_time: input.startTime,
      end_time: input.endTime,
      venue: input.venue,
      university: input.university,
      address: input.address,
      contact_phone: input.contactPhone,
    })
    .eq("id", 1);
  if (error) throw error;
}
