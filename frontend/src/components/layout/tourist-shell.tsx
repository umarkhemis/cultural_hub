
"use client";

import { TopNavbar } from "@/src/components/layout/top-navbar";
import { PublicFooter } from "@/src/components/layout/public-footer";

export function TouristShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNavbar />
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
      <PublicFooter />
    </div>
  );
}


