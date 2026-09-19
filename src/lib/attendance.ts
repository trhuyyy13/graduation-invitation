export const attendanceOptions = [
  { value: "attending", label: "Có thể", adminLabel: "Sẽ có mặt" },
  { value: "not_attending", label: "Không thể", adminLabel: "Không thể tham dự" },
  { value: "maybe_later", label: "Mình sẽ báo lại sau", adminLabel: "Sẽ báo lại sau" },
] as const;

export type AttendanceStatus = (typeof attendanceOptions)[number]["value"];

const attendanceValues = new Set<string>(attendanceOptions.map((option) => option.value));

export function isAttendanceStatus(value: unknown): value is AttendanceStatus {
  return typeof value === "string" && attendanceValues.has(value);
}

export function getAttendanceLabel(value: AttendanceStatus): string {
  return attendanceOptions.find((option) => option.value === value)?.adminLabel ?? value;
}
