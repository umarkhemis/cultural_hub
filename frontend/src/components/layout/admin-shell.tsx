
"use client";

import Link from "next/link";
import { TopNavbar } from "@/src/components/layout/top-navbar";
import { PublicFooter } from "@/src/components/layout/public-footer";

const adminLinks = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Sites", href: "/admin/sites" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Experiences", href: "/admin/experiences" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Reports", href: "/admin/reports" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <TopNavbar />
      <div className="flex-1">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-8">
          <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Admin</h2>
            <nav className="space-y-2">
              {adminLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}