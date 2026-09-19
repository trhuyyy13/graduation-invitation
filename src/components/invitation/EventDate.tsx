import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Map,
  Phone,
  ArrowRight,
  MessageCircleHeart,
} from "lucide-react";
import CardBackdrop from "./CardBackdrop";
import RevealOnScroll from "./RevealOnScroll";
import Countdown from "./Countdown";
import { eventConfig } from "@/config/event";
import { getEventSettings } from "@/lib/eventSettings";
import type { Guest } from "@/lib/guests";

export default async function EventDate({
  guest,
  nextHref,
  backHref,
}: {
  guest: Guest;
  nextHref: string;
  backHref: string;
}) {
  const settings = await getEventSettings();
  const countdownTargetIso = `${settings.date}T${settings.startTime}:00+07:00`;
  const countdownLabel = `${settings.startTime}, ${settings.day}.${settings.month}.${settings.yearLabel}`;

  return (
    <CardBackdrop
      backHref={backHref}
      contentClassName="justify-between pt-10 pb-12 md:pt-14 md:pb-16"
    >
      <RevealOnScroll className="flex flex-col items-center">
        <GraduationCap className="h-7 w-7 stroke-[1.3] text-[#a8804f]" aria-hidden />
        <div className="mt-4 flex items-center justify-center gap-2 text-[#c3a06c]" aria-hidden>
          <span className="h-px w-8 bg-current" />
          <span className="h-1.5 w-1.5 rotate-45 bg-current" />
          <span className="h-px w-8 bg-current" />
        </div>

        <p className="mt-5 text-[0.65rem] font-semibold uppercase leading-none tracking-[0.5em] text-[#9b774d]">
          Thân mời
        </p>
        <p className="mt-2 max-w-[240px] text-center font-script text-4xl font-normal leading-tight text-maroon sm:max-w-[300px] sm:text-5xl">
          {guest.displayName}
        </p>

        <span className="mt-4 h-1.5 w-1.5 rotate-45 bg-[#c3a06c]" aria-hidden />

        <p className="mt-4 font-accent text-base italic text-[#4d4038]">đến tham dự</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold uppercase leading-tight tracking-wide text-[#452420] sm:text-3xl">
          Lễ tốt nghiệp
        </h2>
        <p className="mt-2 font-accent text-base italic text-[#4d4038]">của</p>
        <p className="mt-2 font-serif text-2xl font-medium tracking-wide text-maroon sm:text-3xl">
          {eventConfig.graduateDisplayName}
        </p>

        <span className="mt-5 h-1.5 w-1.5 rotate-45 bg-[#c3a06c]" aria-hidden />
      </RevealOnScroll>

      <RevealOnScroll
        delay={0.1}
        className="mt-6 w-full max-w-[320px] rounded-2xl bg-[#fbf3e7]/95 p-5 text-left shadow-[0_14px_30px_rgba(60,20,10,0.16)] ring-1 ring-[#e7d3ad]/70 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-maroon" aria-hidden />
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-maroon">
              Thời gian
            </p>
            <p className="mt-1 text-sm text-[#4d4038]">
              {settings.startTime} – {settings.endTime}, {settings.weekdayLabel}
            </p>
            <p className="text-sm font-semibold text-[#2b2320]">
              {settings.day}.{settings.month}.{settings.yearLabel}
            </p>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-[#e7d3ad]" aria-hidden />

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-maroon" aria-hidden />
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-maroon">
              Địa điểm
            </p>
            <p className="mt-1 text-sm font-semibold text-[#2b2320]">{settings.venue}</p>
            <p className="text-sm text-[#6b6058]">{settings.university}</p>
            <p className="text-sm text-[#6b6058]">{settings.address}</p>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-[#e7d3ad]" aria-hidden />

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-maroon" aria-hidden />
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-maroon">
              Liên hệ
            </p>
            <a
              href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`}
              className="focus-ring mt-1 inline-block text-sm font-semibold text-[#2b2320] underline-offset-2 hover:underline"
            >
              {settings.contactPhone}
            </a>
            {settings.contactPhone2 && (
              <a
                href={`tel:${settings.contactPhone2.replace(/[^\d+]/g, "")}`}
                className="focus-ring mt-1 block text-sm font-semibold text-[#2b2320] underline-offset-2 hover:underline"
              >
                {settings.contactPhone2}
              </a>
            )}
          </div>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15} className="mt-6 flex w-full justify-center">
        <Countdown targetIso={countdownTargetIso} targetLabel={countdownLabel} />
      </RevealOnScroll>

      <RevealOnScroll delay={0.2} className="flex w-full max-w-[320px] flex-col gap-3">
        <div className="mt-6 grid grid-cols-2 gap-2">
          <a
            href={settings.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex min-h-[48px] items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#5c0c0d] px-2 text-[0.6rem] font-semibold uppercase tracking-[0.05em] text-warm-white shadow-[0_10px_24px_rgba(30,6,6,0.35)] transition-colors hover:bg-[#4c0709] sm:gap-1.5 sm:px-3 sm:text-[0.65rem] sm:tracking-[0.12em]"
          >
            Chỉ đường
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </a>

          <a
            href="/images/map/hust-c2-campus-map.png"
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex min-h-[48px] items-center justify-center gap-1 whitespace-nowrap rounded-full border border-maroon/40 bg-transparent px-2 text-[0.6rem] font-semibold uppercase tracking-[0.05em] text-maroon shadow-[0_6px_16px_rgba(60,20,10,0.1)] transition-colors hover:bg-maroon hover:text-warm-white sm:gap-1.5 sm:px-3 sm:text-[0.65rem] sm:tracking-[0.12em]"
          >
            Xem map
            <Map className="h-4 w-4 shrink-0" aria-hidden />
          </a>
        </div>

        <Link
          href={nextHref}
          className="focus-ring inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#5c0c0d] px-3 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-warm-white shadow-[0_10px_24px_rgba(30,6,6,0.35)] transition-colors hover:bg-[#4c0709] sm:gap-2 sm:px-6 sm:text-xs sm:tracking-[0.3em]"
        >
          Đọc và viết lưu bút
          <MessageCircleHeart className="h-4 w-4" aria-hidden />
        </Link>
      </RevealOnScroll>
    </CardBackdrop>
  );
}
