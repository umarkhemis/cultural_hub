
"use client";

import { TouristShell } from "@/src/components/layout/tourist-shell";
import { useRequireRole } from "@/src/hooks/useRequireRole";

export default function TouristLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasHydrated } = useRequireRole(["tourist"]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading...
      </div>
    );
  }

  return <TouristShell>{children}</TouristShell>;
}