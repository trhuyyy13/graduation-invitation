"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { eventConfig } from "@/config/event";
import { personalize } from "@/lib/personalize";
import type { Guest } from "@/lib/guests";

export default function MessageForm({ guest }: { guest: Guest }) {
  const [name, setName] = useState(guest.displayName !== "Bạn" ? guest.displayName : "");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: guest.slug, name, message }),
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
          {personalize("Lời nhắn của {you} đã được gửi đến", guest)} {eventConfig.graduateFirstName}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        required
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Viết lời nhắn của bạn..."
        className="focus-ring w-full resize-none rounded-lg border border-[#d8bf8e] bg-[#fffdf9] p-3 font-accent text-base italic text-[#4d4038] placeholder:text-[#a8804f]/60 focus:border-maroon"
      />

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
        {status === "sending" ? "Đang gửi..." : "Gửi lời nhắn"}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
}
