import type { Metadata } from "next";
import InvitationCard from "@/components/invitation/InvitationCard";
import PageShell from "@/components/invitation/PageShell";
import { getGuestBySlug } from "@/lib/guests";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  return {
    title: `Thân mời ${guest.displayName} — Lễ Tốt Nghiệp Huy Trần`,
  };
}

export default async function GuestInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  return (
    <PageShell>
      <InvitationCard guest={guest} nextHref={`/${slug}/2`} />
    </PageShell>
  );
}
