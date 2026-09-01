import type { Metadata } from "next";
import EventDate from "@/components/invitation/EventDate";
import PageShell from "@/components/invitation/PageShell";
import { getGuestBySlug } from "@/lib/guests";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);
  return {
    title: `Thân mời ${guest.displayName} — Lễ Tốt Nghiệp Huy Trần`,
  };
}

export default async function GuestEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);
  return (
    <PageShell>
      <EventDate guest={guest} nextHref={`/${slug}/3`} backHref={`/${slug}`} />
    </PageShell>
  );
}
