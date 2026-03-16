
"use client";

import { ProviderShell } from "@/src/components/layout/provider-shell";
import { useRequireRole } from "@/src/hooks/useRequireRole";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasHydrated } = useRequireRole(["provider"]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  return <ProviderShell>{children}</ProviderShell>;
}