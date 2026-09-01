import type { Metadata } from "next";
import PersonalMessage from "@/components/invitation/PersonalMessage";
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

export default async function GuestMessagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guest = getGuestBySlug(slug);
  return (
    <PageShell>
      <PersonalMessage guest={guest} backHref={`/${slug}/2`} />
    </PageShell>
  );
}
