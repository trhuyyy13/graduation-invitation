import type { Metadata } from "next";
import EventDate from "@/components/invitation/EventDate";
import PageShell from "@/components/invitation/PageShell";
import { genericGuest } from "@/lib/guests";

export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp Huy Trần — Thông tin sự kiện",
};

export default function GenericEventPage() {
  return (
    <PageShell>
      <EventDate guest={genericGuest} nextHref="/loi-nhan" backHref="/" />
    </PageShell>
  );
}
