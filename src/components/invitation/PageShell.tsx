import type { ReactNode } from "react";

export default function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-svh bg-ivory md:flex md:items-start md:justify-center md:bg-neutral-200 md:py-10">
      <div className="w-full md:max-w-invite">{children}</div>
    </main>
  );
}
