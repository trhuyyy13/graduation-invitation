import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { eventConfig } from "@/config/event";

export default function CardBackdrop({
  id,
  children,
  contentClassName = "",
  backHref,
}: {
  id?: string;
  children: ReactNode;
  contentClassName?: string;
  backHref?: string;
}) {
  return (
    <section
      id={id}
      className="relative mx-auto min-h-svh max-w-invite overflow-hidden text-center md:min-h-[900px] md:rounded-[24px] md:shadow-card"
    >
      <Image
        src="/images/background/hust-paper-bg.png"
        alt=""
        fill
        priority
        sizes="(min-width: 640px) 520px, 100vw"
        className="object-cover object-bottom"
        aria-hidden
      />

      <Image
        src="/images/sash/hust-sash.png"
        alt={`Dải sash tốt nghiệp HUST của ${eventConfig.graduateFullName}`}
        width={724}
        height={2172}
        priority
        className="absolute left-0 top-0 z-10 w-[37%] max-w-[228px] drop-shadow-[0_18px_22px_rgba(69,18,16,0.35)]"
      />

      {backHref && (
        <Link
          href={backHref}
          aria-label="Quay lại"
          className="focus-ring absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-warm-white/80 text-maroon shadow-[0_4px_10px_rgba(60,20,10,0.18)] backdrop-blur-sm transition-colors hover:bg-warm-white sm:right-5 sm:top-5"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Link>
      )}

      <div
        className={`relative z-20 flex min-h-svh flex-col items-center pl-[41%] pr-[6%] md:min-h-[900px] ${contentClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
