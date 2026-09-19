"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Map, X } from "lucide-react";

export default function MapPreviewButton({
  imageSrc,
  className,
}: {
  imageSrc: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Map HUST
        <Map className="h-4 w-4 shrink-0" aria-hidden />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="focus-ring absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#5c0c0d] text-warm-white shadow-[0_6px_14px_rgba(30,6,6,0.4)] hover:bg-[#4c0709]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <Image
              src={imageSrc}
              alt="Sơ đồ khuôn viên Đại học Bách khoa Hà Nội"
              width={924}
              height={570}
              className="w-full rounded-xl border-2 border-[#e7d3ad] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
      )}
    </>
  );
}
