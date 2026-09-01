import { eventConfig } from "@/config/event";

function toIcsDate(date: string, time: string): string {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":");
  return `${y}${m}${d}T${hh}${mm}00`;
}

function escapeIcsText(text: string): string {
  return text.replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");
}

export function downloadEventIcs(): void {
  const { date, startTime, endTime, venue, address, graduateDisplayName } =
    eventConfig;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Graduation Invitation//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${date}-graduation-${graduateDisplayName.replace(/\s+/g, "-")}@invitation`,
    `DTSTAMP:${toIcsDate(date, startTime)}Z`,
    `DTSTART:${toIcsDate(date, startTime)}`,
    `DTEND:${toIcsDate(date, endTime)}`,
    `SUMMARY:${escapeIcsText(`Lễ tốt nghiệp của ${graduateDisplayName}`)}`,
    `LOCATION:${escapeIcsText(`${venue}, ${address}`)}`,
    `DESCRIPTION:${escapeIcsText(`Thân mời bạn đến tham dự lễ tốt nghiệp của ${graduateDisplayName} tại ${venue}.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "le-tot-nghiep-huy-tran.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
