// frontend\src\components\layout\top-navbar.tsx

"use client";

import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { ROUTES } from "@/src/constants/routes";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { BrandLogo } from "@/src/components/common/brand-logo";

export function TopNavbar() {
  const router = useRouter();
  const { isAuthenticated, user, clearSession } = useAuth();
  const { addToast } = useToastStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">

      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-lg bg-black/70 border-b border-white/10 shadow-md"
            : "backdrop-blur-md bg-black/20 border-b border-white/10"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


          {/* ── Logo ── */}
          <BrandLogo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 lg:flex">
            {visibleBaseLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/80 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
            {roleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/80 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={isProvider ? ROUTES.providerRoot : ROUTES.touristProfile}
                  className="hidden items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10 sm:inline-flex backdrop-blur-sm"
                >
                  <User className="h-4 w-4" />
                  {user.full_name.split(" ")[0]}
                </Link>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-white hover:bg-white/10"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.login} className="hidden sm:block">
                  <Button variant="ghost" className="text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>

                <Link href={ROUTES.register}>
                  <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/80 backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!isAuthenticated && (
              <Link
                href={ROUTES.login}
                className="rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
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


