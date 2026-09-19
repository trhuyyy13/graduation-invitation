"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { attendanceOptions, type AttendanceStatus } from "@/lib/attendance";
import { eventConfig } from "@/config/event";
import { personalize } from "@/lib/personalize";
import type { Guest } from "@/lib/guests";

export default function MessageForm({ guest }: { guest: Guest }) {
  const [name, setName] = useState(guest.displayName !== "Bạn" ? guest.displayName : "");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<AttendanceStatus | "">("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || !attendance || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: guest.slug, name, message, attendance }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-1 py-4 text-center">
        <p className="font-serif text-xl text-maroon">
          {personalize("Cảm ơn {you} rất nhiều!", guest)}
        </p>
        <p className="text-sm text-[#6b6058]">
          {personalize("Lưu bút của {you} đã được gửi đến", guest)} {eventConfig.graduateFirstName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        required
        rows={8}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Viết lưu bút của bạn..."
        className="focus-ring min-h-[220px] w-full resize-y rounded-lg border border-[#d8bf8e] bg-[#fffdf9] p-4 font-accent text-base italic text-[#4d4038] placeholder:text-[#a8804f]/60 focus:border-maroon"
      />

      <div>
        <p className="mb-2 text-sm font-medium text-[#4d4038]">
          {personalize("{you} sẽ có mặt chứ?", guest)}
        </p>
        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-[#d8bf8e] bg-[#fffdf9] p-1.5">
          {attendanceOptions.map((option) => (
            <label
              key={option.value}
              className={`focus-within:ring-maroon/30 flex min-h-[42px] cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-center text-[0.72rem] font-semibold leading-snug transition-colors focus-within:ring-2 sm:text-xs ${
                attendance === option.value
                  ? "bg-[#5c0c0d] text-warm-white shadow-[0_6px_14px_rgba(92,12,13,0.22)]"
                  : "text-[#6b6058] hover:bg-[#f6efe3] hover:text-maroon"
              }`}
            >
              <input
                required
                type="radio"
                name="attendance"
                value={option.value}
                checked={attendance === option.value}
                onChange={() => setAttendance(option.value)}
                className="sr-only"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#4d4038]">Tên của bạn</label>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={guest.displayName !== "Bạn" ? guest.displayName : "Tên của bạn"}
          className="focus-ring w-full rounded-lg border border-[#d8bf8e] bg-[#fffdf9] p-3 font-accent text-base italic text-[#4d4038] placeholder:text-[#a8804f]/60 focus:border-maroon"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-maroon">Có lỗi xảy ra, bạn thử gửi lại nhé.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="focus-ring inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#5c0c0d] px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-warm-white shadow-[0_10px_24px_rgba(30,6,6,0.35)] transition-colors hover:bg-[#4c0709] disabled:opacity-60 sm:gap-2 sm:px-6 sm:text-xs sm:tracking-[0.3em]"
      >
        {status === "sending" ? "Đang gửi..." : "Gửi lưu bút"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
