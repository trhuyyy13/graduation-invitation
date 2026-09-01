"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import CardBackdrop from "./CardBackdrop";
import { eventConfig } from "@/config/event";
import type { Guest } from "@/lib/guests";

function EnvelopeMonogram() {
  return (
    <svg viewBox="0 0 48 48" className="h-full w-full" aria-hidden="true">
      <circle cx="24" cy="24" r="20.5" fill="none" stroke="#e9cd97" strokeWidth="1.3" />
      <circle cx="24" cy="24" r="16.6" fill="none" stroke="#e9cd97" strokeWidth="0.6" opacity={0.7} />
      <path
        d="M24 9.5 L25.4 13.6 L29.7 13.6 L26.2 16.2 L27.5 20.3 L24 17.7 L20.5 20.3 L21.8 16.2 L18.3 13.6 L22.6 13.6 Z"
        fill="#e9cd97"
        opacity={0.9}
      />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fontSize="16.5"
        fontWeight={600}
        fill="#e9cd97"
        fontFamily="var(--font-playfair), serif"
      >
        H
      </text>
      <path
        d="M14 36.8c4-2.2 16-2.2 20 0"
        stroke="#e9cd97"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity={0.75}
      />
    </svg>
  );
}

export default function InvitationCard({
  guest,
  nextHref,
}: {
  guest: Guest;
  nextHref: string;
}) {
  const [opened, setOpened] = useState(false);
  const reduceMotion = !!useReducedMotion();
  const router = useRouter();

  useEffect(() => {
    router.prefetch(nextHref);
  }, [router, nextHref]);

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    window.setTimeout(
      () => {
        router.push(nextHref);
      },
      reduceMotion ? 50 : 1250
    );
  }

  return (
    <CardBackdrop contentClassName="pt-10 pb-14 md:pt-12 md:pb-20">
      <GraduationCap className="h-8 w-8 stroke-[1.3] text-[#a8804f]" aria-hidden />

      <p className="mt-6 text-[0.65rem] font-semibold uppercase leading-none tracking-[0.5em] text-[#9b774d] sm:text-[0.78rem]">
        Graduation Ceremony
      </p>

      <h1 className="mt-6 font-serif text-[1.9rem] font-medium uppercase leading-tight text-[#452420] sm:text-[2.6rem]">
        {eventConfig.graduateFullName}
      </h1>

      <div className="mt-6 flex items-center justify-center gap-2 text-[#a8804f]" aria-hidden>
        <span className="h-px w-14 bg-current sm:w-20" />
        <span className="h-1.5 w-1.5 rotate-45 bg-current" />
        <span className="h-2 w-2 rotate-45 border border-current" />
        <span className="h-1.5 w-1.5 rotate-45 bg-current" />
        <span className="h-px w-14 bg-current sm:w-20" />
      </div>

      <p className="mt-7 max-w-[300px] font-serif text-lg leading-snug text-[#4d4038] sm:text-xl">
        Một lời mời <span className="font-semibold text-maroon">đặc biệt</span> dành cho{" "}
        <span className="whitespace-nowrap">{guest.salutation || "Bạn"}</span>
      </p>

      <motion.div
        className="relative mt-3 h-[152px] w-[72%] max-w-[290px] sm:mt-4 sm:h-[196px] sm:max-w-[350px]"
        style={{ perspective: 900 }}
        animate={{ y: opened ? -6 : 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.4 }}
      >
        <div className="absolute inset-x-0 bottom-0 h-[78%] overflow-hidden rounded-[5px] bg-[#5c0c0d] shadow-[0_20px_36px_rgba(30,6,6,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_20%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(115deg,rgba(255,255,255,0.05),transparent_36%),repeating-linear-gradient(120deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_5px)]" />
          <motion.div
            className="absolute inset-x-0 top-0 h-[72%] origin-top rounded-b-[10px] bg-[#4c0709] shadow-[0_8px_18px_rgba(15,2,2,0.5)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateX: opened ? -160 : 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: [0.65, 0, 0.35, 1] }}
          />
          <div className="absolute bottom-0 left-0 h-full w-[52%] bg-[#4a0709] opacity-60 [clip-path:polygon(0_12%,100%_58%,0_100%)]" />
          <div className="absolute bottom-0 right-0 h-full w-[52%] bg-[#3c0507] opacity-55 [clip-path:polygon(100%_12%,0_58%,100%_100%)]" />
        </div>

        <motion.div
          className="absolute inset-x-[14%] top-[10%] z-[5] h-[62%] rounded-[3px] bg-[#fbf3e7] shadow-[0_14px_26px_rgba(20,4,4,0.35)]"
          initial={{ y: 30, opacity: 0 }}
          animate={opened ? { y: -52, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.01 : 0.55,
            delay: reduceMotion ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="pointer-events-none absolute inset-[6px] rounded-[2px] border border-[#d8bf8e]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
            <span className="h-[3px] w-[3px] rotate-45 bg-[#a8804f]" />
            <span className="h-px w-10 bg-[#c3a06c]" />
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={opened}
          aria-label="Mở thư mời"
          style={{ x: "-50%", y: "-50%" }}
          whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          animate={{ opacity: opened ? 0 : 1, scale: opened ? 0.5 : 1 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.3 }}
          className="focus-ring absolute left-1/2 top-[76%] z-10 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#601011] p-[11px] shadow-[0_8px_16px_rgba(15,2,2,0.5),inset_0_3px_4px_rgba(255,255,255,0.16),inset_0_-5px_7px_rgba(15,2,2,0.6)] sm:h-[76px] sm:w-[76px] sm:p-[13px]"
        >
          <EnvelopeMonogram />
        </motion.button>
      </motion.div>

      <div className="relative left-1/2 mt-8 w-max max-w-[80vw] -translate-x-1/2 text-center">
        <div className="flex items-center justify-center gap-2 text-[#c3a06c]" aria-hidden>
          <span className="h-px w-8 bg-current" />
          <span className="h-2 w-2 rotate-45 bg-current" />
          <span className="h-px w-8 bg-current" />
        </div>
      </div>
    </CardBackdrop>
  );
}
