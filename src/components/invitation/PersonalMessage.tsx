import { GraduationCap } from "lucide-react";
import CardBackdrop from "./CardBackdrop";
import RevealOnScroll from "./RevealOnScroll";
import MessageForm from "./MessageForm";
import { eventConfig } from "@/config/event";
import { personalize } from "@/lib/personalize";
import type { Guest } from "@/lib/guests";

function CornerAccents() {
  const base = "pointer-events-none absolute h-4 w-4 border-[#c3a06c]";
  return (
    <>
      <span className={`${base} left-2 top-2 border-l-2 border-t-2`} aria-hidden />
      <span className={`${base} right-2 top-2 border-r-2 border-t-2`} aria-hidden />
      <span className={`${base} bottom-2 left-2 border-b-2 border-l-2`} aria-hidden />
      <span className={`${base} bottom-2 right-2 border-b-2 border-r-2`} aria-hidden />
    </>
  );
}

export default function PersonalMessage({
  guest,
  backHref,
}: {
  guest: Guest;
  backHref: string;
}) {
  return (
    <CardBackdrop backHref={backHref} contentClassName="pt-10 pb-14 md:pt-14 md:pb-20">
      <RevealOnScroll className="flex flex-col items-center">
        <GraduationCap className="h-7 w-7 stroke-[1.3] text-[#a8804f]" aria-hidden />
        <span className="mt-4 h-1.5 w-1.5 rotate-45 bg-[#c3a06c]" aria-hidden />

        <h1 className="mt-5 max-w-[280px] text-center font-serif text-[1.7rem] font-semibold uppercase leading-tight tracking-wide text-maroon sm:max-w-[320px] sm:text-3xl">
          Đôi lời nhắn gửi
        </h1>
        <span className="mt-3 h-1.5 w-1.5 rotate-45 bg-[#c3a06c]" aria-hidden />

        <div className="mt-6 flex max-w-[290px] flex-col gap-4 text-left font-serif text-[0.82rem] leading-relaxed text-[#4d4038] sm:max-w-[340px] sm:text-[0.92rem]">
          {eventConfig.personalMessage.paragraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {personalize(paragraph, guest)}
            </p>
          ))}
        </div>

        <p className="mt-6 font-accent text-xl italic text-maroon">
          {eventConfig.personalMessage.signature}
        </p>
        <p className="text-sm text-[#9b774d]">{eventConfig.year}</p>
      </RevealOnScroll>

      <RevealOnScroll
        delay={0.1}
        className="mt-8 w-full max-w-[340px] rounded-2xl border border-[#d8bf8e] bg-[#fbf3e7]/95 p-5 text-center shadow-[0_14px_30px_rgba(60,20,10,0.16)] sm:p-7"
      >
        <CornerAccents />

        <h2 className="font-serif text-base font-semibold uppercase leading-snug tracking-normal text-maroon sm:text-xl sm:tracking-wide">
          Gửi {eventConfig.graduateFirstName} một lời nhắn
        </h2>
        <p className="mt-2 text-sm text-[#6b6058]">
          {personalize("Một vài dòng từ {you} sẽ là một phần rất đẹp của ngày hôm đó.", guest)}
        </p>

        <div className="mt-5 text-left">
          <MessageForm guest={guest} />
        </div>
      </RevealOnScroll>
    </CardBackdrop>
  );
}
