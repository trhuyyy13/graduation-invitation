"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetIso: string): TimeLeft | null {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Ngày" },
  { key: "hours", label: "Giờ" },
  { key: "minutes", label: "Phút" },
  { key: "seconds", label: "Giây" },
];

export default function Countdown({
  targetIso,
  targetLabel,
}: {
  targetIso: string;
  targetLabel: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(targetIso));
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!mounted) return null;

  if (!timeLeft) {
    return (
      <div className="w-full max-w-[320px] rounded-2xl bg-[#fbf3e7]/95 px-5 py-4 text-center shadow-[0_14px_30px_rgba(60,20,10,0.16)] ring-1 ring-[#e7d3ad]/70">
        <p className="font-script text-2xl text-maroon">Lễ tốt nghiệp đã bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-[#fbf3e7]/95 px-5 py-5 text-center shadow-[0_14px_30px_rgba(60,20,10,0.16)] ring-1 ring-[#e7d3ad]/70 sm:px-7">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#9b774d]">
        Đếm ngược thời gian tốt nghiệp
      </p>

      <div className="mx-auto mt-4 grid max-w-[220px] grid-cols-2 gap-x-6 gap-y-4 sm:max-w-[240px]">
        {UNITS.map((unit) => (
          <div key={unit.key} className="flex flex-col items-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-[#5c0c0d] shadow-[0_8px_18px_rgba(30,6,6,0.35)] ring-1 ring-[#c3a06c]/60 sm:h-[4.5rem] sm:w-[4.5rem]">
              <span className="font-serif text-2xl font-semibold tabular-nums text-warm-white sm:text-[1.7rem]">
                {String(timeLeft[unit.key]).padStart(2, "0")}
              </span>
            </div>
            <span className="mt-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-[#9b774d]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 font-accent text-sm italic text-[#4d4038]">
        Hẹn gặp bạn lúc {targetLabel}
      </p>
    </div>
  );
}
