// frontend\src\components\layout\public-footer.tsx

"use client";

import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/hooks/useAuth";
import {
  MapPin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";
import { BrandLogo } from "@/src/components/common/brand-logo";

export function PublicFooter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">

          {/* BRAND */}
          <div className="space-y-4">
            <div className="space-y-3">
              <BrandLogo size="sm" showTagline={false} />
            </div>

            <p className="text-sm leading-6 text-slate-400 max-w-sm">
              Connecting travelers with authentic cultural experiences and local providers.
              Discover places, watch real moments, and connect with communities worldwide.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Explore
            </p>

            <div className="flex flex-col gap-3 text-sm">
              <Link href={ROUTES.feed} className="hover:text-orange-400 transition-colors">
                Experiences Feed
              </Link>

              <Link href={ROUTES.packages} className="hover:text-orange-400 transition-colors">
                Cultural Packages
              </Link>

              <Link href={ROUTES.sites} className="hover:text-green-400 transition-colors">
                Cultural Sites
              </Link>
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Account
            </p>

            <div className="flex flex-col gap-3 text-sm">
              {!isAuthenticated ? (
                <Link href={ROUTES.login} className="hover:text-orange-400 transition-colors">
                  Login
                </Link>
              ) : user?.role === "provider" ? (
                <Link href={ROUTES.providerRoot} className="hover:text-orange-400 transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link href={ROUTES.touristBookings} className="hover:text-orange-400 transition-colors">
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

          {/* SOCIALS */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Connect
            </p>

            <div className="flex flex-col gap-3 text-sm">

              {/* Gmail */}
              <a
                href="mailto:hubcultural1@gmail.com"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                Gmail
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/CulturalHu18003"
                target="_blank"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                X (Twitter)
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@CulturalHub-ch"
                target="_blank"
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                <Youtube className="h-4 w-4" />
                YouTube
              </a>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-800" />

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} CulturalHub. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">

            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-green-400" />
              <span>Empowering cultural tourism worldwide</span>
            </div>

            <div>
              Built by{" "}
              <Link
                href="https://www.beta-techlabs.com"
                target="_blank"
                className="text-orange-400 hover:text-orange-300 transition-colors font-medium"
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