"use client";

import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/hooks/useAuth";
import { MapPin, Globe } from "lucide-react";

export function PublicFooter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-3">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-sky-400" />
              <span className="text-base font-semibold text-white tracking-tight">
                CulturalHub
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-500 max-w-xs">
              Connecting travelers with authentic cultural experiences and local providers around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Quick Links
            </p>

            <div className="flex flex-col gap-2 text-sm">
              <Link href={ROUTES.feed} className="hover:text-sky-400 transition-colors">
                Feed
              </Link>
              <Link href={ROUTES.packages} className="hover:text-sky-400 transition-colors">
                Packages
              </Link>
              <Link href={ROUTES.sites} className="hover:text-green-400 transition-colors">
                Cultural Sites
              </Link>
            </div>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Account
            </p>

            <div className="flex flex-col gap-2 text-sm">
              {!isAuthenticated ? (
                <Link href={ROUTES.login} className="hover:text-sky-400 transition-colors">
                  Login
                </Link>
              ) : user?.role === "provider" ? (
                <Link href={ROUTES.providerRoot} className="hover:text-sky-400 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link href={ROUTES.touristBookings} className="hover:text-sky-400 transition-colors">
                  My Bookings
                </Link>
              )}

              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>

              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} CulturalHub. All rights reserved.
          </p>

          <div className="flex items-center gap-4 flex-wrap">

            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-green-400" />
              <span>Empowering cultural tourism worldwide</span>
            </div>

            {/* Built by credit */}
            <div>
              Built by{" "}
              <Link
                href="https://www.beta-techlabs.com"
                target="_blank"
                className="text-sky-400 hover:text-sky-300 transition-colors font-medium"
              >
                Beta-Tech Labs
              </Link>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}