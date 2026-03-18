
"use client";

import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/hooks/useAuth";
import { MapPin, Globe } from "lucide-react";

export function PublicFooter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top section */}
        <div className="grid grid-cols-1 gap-6 py-7 sm:grid-cols-3">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-semibold text-white tracking-tight">
                CulturalHub
              </span>
            </div>
            <p className="text-xs leading-5 text-slate-500 max-w-xs">
              Connecting travelers with authentic cultural experiences and
              local providers around the world.
            </p>
          </div>

          {/* Explore Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
              Explore
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              <Link href={ROUTES.feed} className="hover:text-amber-400 transition-colors">
                Feed
              </Link>
              <Link href={ROUTES.packages} className="hover:text-amber-400 transition-colors">
                Packages
              </Link>
              <Link href={ROUTES.sites} className="hover:text-amber-400 transition-colors">
                Cultural Sites
              </Link>
            </div>
          </div>

          {/* Account Links */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
              Account
            </p>
            <div className="flex flex-col gap-1.5 text-xs">
              {!isAuthenticated ? (
                <Link href={ROUTES.login} className="hover:text-amber-400 transition-colors">
                  Login
                </Link>
              ) : user?.role === "provider" ? (
                <Link href={ROUTES.providerRoot} className="hover:text-amber-400 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link href={ROUTES.touristBookings} className="hover:text-amber-400 transition-colors">
                  My Bookings
                </Link>
              )}
              <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-800 py-4 text-xs text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} CulturalHub. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-amber-400" />
            <span>Empowering cultural tourism worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}





