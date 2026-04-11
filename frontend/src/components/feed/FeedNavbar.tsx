
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  Globe,
  Package,
  CalendarCheck,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";

export function FeedNavbar({
  onSearchOpen,
}: {
  onSearchOpen: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Sites", href: ROUTES.sites, icon: Globe },
    { label: "Packages", href: ROUTES.packages, icon: Package },
    ...(isAuthenticated && user?.role === "tourist"
      ? [
          {
            label: "Bookings",
            href: ROUTES.touristBookings,
            icon: CalendarCheck,
          },
        ]
      : []),
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-40">

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link
          href={ROUTES.welcome}
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-md px-2.5 py-1.5"
        >
          <img
            src="/mock/logo_cultural_hub-bg.png"
            alt="CulturalHub"
            className="h-7 w-7 object-contain shrink-0"
          />
          <span className="text-sm font-semibold text-amber-400 tracking-wide leading-none">
            CulturalHub
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="pointer-events-auto hidden items-center gap-1 rounded-2xl border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right controls */}
        <div className="pointer-events-auto flex items-center gap-2">

          {/* Search */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSearchOpen();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all sm:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Sign in */}
          {!isAuthenticated && (
            <Link
              href={ROUTES.login}
              onClick={(e) => e.stopPropagation()}
              className="hidden rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition-all sm:block"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="pointer-events-auto mx-4 mt-1 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <link.icon className="h-4 w-4 shrink-0 text-amber-400" />
              {link.label}
            </Link>
          ))}

          {!isAuthenticated && (
            <Link
              href={ROUTES.login}
              onClick={() => setMenuOpen(false)}
              className="mt-1.5 flex items-center justify-center rounded-xl bg-amber-400 px-3 py-2.5 text-sm font-bold text-slate-900 hover:bg-amber-300 transition-all"
            >
              Sign in to CulturalHub
            </Link>
          )}
        </div>
      )}
    </div>
  );
}


