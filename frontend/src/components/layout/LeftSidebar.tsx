// frontend\src\components\layout\LeftSidebar.tsx

"use client";

import Link from "next/link";
import {
  Home,
  Bell,
  User,
  Compass,
  LogIn,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { cn } from "@/src/utils/cn";

export function LeftSidebar() {
  const { user } = useAuth();

  return (
    <div className="flex h-full w-full flex-col px-4 py-6">

      {/* 🔶 LOGO */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400 text-black font-bold">
          CH
        </div>
        <span className="text-lg font-semibold text-slate-900">
          CulturalHub
        </span>
      </div>

      {/* 🔷 NAV */}
      <nav className="flex flex-col gap-2">

        <SidebarItem
          href="/"
          icon={<Home className="h-5 w-5" />}
          label="Home"
        />

        <SidebarItem
          href="/explore"
          icon={<Compass className="h-5 w-5" />}
          label="Explore Sites"
        />

        {user && (
          <>
            <SidebarItem
              href="/notifications"
              icon={<Bell className="h-5 w-5" />}
              label="Notifications"
            />

            <SidebarItem
              href="/profile"
              icon={<User className="h-5 w-5" />}
              label="Profile"
            />
          </>
        )}

        {!user && (
          <SidebarItem
            href="/login"
            icon={<LogIn className="h-5 w-5" />}
            label="Login"
          />
        )}

      </nav>

      {/* 🔻 FOOTER */}
      <div className="mt-auto px-2 text-xs text-slate-400">
        © {new Date().getFullYear()} CulturalHub
      </div>
    </div>
  );
}

// 🔹 Reusable Item
function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition",
        "hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}