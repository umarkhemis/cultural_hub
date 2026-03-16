
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { providerNavItems } from "@/src/constants/navigation";
import { cn } from "@/src/utils/cn";

export function ProviderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <div className="mb-6 px-2">
            <h2 className="text-lg font-semibold text-slate-900">Provider Panel</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage experiences, packages, and bookings.
            </p>
          </div>

          <nav className="space-y-2">
            {providerNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-4xl grid-cols-3">
          {providerNavItems.slice(0, 6).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center px-2 py-4 text-xs font-medium sm:text-sm",
                  active ? "text-slate-900" : "text-slate-500"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}