import type { Metadata } from "next";
import PersonalMessage from "@/components/invitation/PersonalMessage";
import PageShell from "@/components/invitation/PageShell";
import { genericGuest } from "@/lib/guests";

export const metadata: Metadata = {
  title: "Lễ Tốt Nghiệp Huy Trần — Gửi lời nhắn",
};

export default function GenericMessagePage() {
  return (
    <PageShell>
      <PersonalMessage guest={genericGuest} backHref="/xem-loi-moi" />
    </PageShell>
  );
}
