import InvitationCard from "@/components/invitation/InvitationCard";
import PageShell from "@/components/invitation/PageShell";
import { genericGuest } from "@/lib/guests";

export default function HomePage() {
  return (
    <PageShell>
      <InvitationCard guest={genericGuest} nextHref="/xem-loi-moi" />
    </PageShell>
  );
}
