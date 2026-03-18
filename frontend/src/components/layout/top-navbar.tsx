
"use client";

import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/src/constants/routes";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";

export function TopNavbar() {
  const router = useRouter();
  const { isAuthenticated, user, clearSession } = useAuth();
  const { addToast } = useToastStore();
  const [open, setOpen] = useState(false);

  const baseLinks = [
    { label: "Explore", href: ROUTES.feed },
    { label: "Packages", href: ROUTES.packages },
    { label: "Cultural Sites", href: ROUTES.sites },
  ];

  const touristLinks = [
    { label: "My Bookings", href: ROUTES.touristBookings },
    { label: "Notifications", href: ROUTES.touristNotifications },
    { label: "Profile", href: ROUTES.touristProfile },
  ];

  const providerLinks = [
    { label: "Dashboard", href: ROUTES.providerRoot },
    { label: "Experiences", href: ROUTES.providerExperiences },
    { label: "Packages", href: ROUTES.providerPackages },
    { label: "Bookings", href: ROUTES.providerBookings },
    { label: "Profile", href: ROUTES.providerProfile },
  ];

  const isProvider = user?.role === "provider";

  const roleLinks = isProvider
    ? providerLinks
    : user?.role === "tourist"
    ? touristLinks
    : [];

  // Hide base links for providers — they have their own nav
  const visibleBaseLinks = isProvider ? [] : baseLinks;

  const mobileLinks = [...visibleBaseLinks, ...roleLinks];

  const handleLogout = () => {
    clearSession();
    setOpen(false);
    addToast({
      type: "success",
      title: "Logged out",
      description: "Your session has been cleared successfully.",
    });
    router.push(ROUTES.welcome);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.welcome} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            CT
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">CulturalHub</p>
            <p className="text-xs text-slate-500">Explore Culture</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {visibleBaseLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-700 hover:text-slate-900">
              {item.label}
            </Link>
          ))}

          {roleLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-700 hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Link
                href={isProvider ? ROUTES.providerRoot : ROUTES.touristProfile}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 sm:inline-flex"
              >
                <User className="h-4 w-4" />
                {user.full_name.split(" ")[0]}
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href={ROUTES.login} className="hidden sm:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href={ROUTES.register}>
                <Button>Get Started</Button>
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                href={ROUTES.login}
                className="rounded-xl px-3 py-3 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


