
"use client";

import { AdminShell } from "@/src/components/layout/admin-shell";
import { useRequireRole } from "@/src/hooks/useRequireRole";
import { LoadingState } from "@/src/components/shared/loading-state";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasHydrated } = useRequireRole(["admin"]);

  if (!hasHydrated) {
    return <LoadingState />;
  }

  return <AdminShell>{children}</AdminShell>;
}

