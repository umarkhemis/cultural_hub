
// frontend\src\components\layout\top-navbar.tsx

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu, X, LogIn, LogOut,
  Play, BookOpen, Bell,
  Globe, Package, LayoutDashboard,
  CalendarCheck, UserCircle, Search,
} from "lucide-react";

import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";
import { BrandLogo } from "@/src/components/common/brand-logo";
import { LanguageSwitcher } from "@/src/components/common/language-switcher";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const PUBLIC_NAV: NavItem[] = [
  { label: "Feed",           href: ROUTES.feed,     icon: Play    },
  { label: "Packages",       href: ROUTES.packages, icon: Package },
  { label: "Cultural Sites", href: ROUTES.sites,    icon: Globe   },
];

const TOURIST_NAV: NavItem[] = [
  { label: "Feed",          href: ROUTES.feed,                 icon: Play       },
  { label: "Bookings",      href: ROUTES.touristBookings,      icon: BookOpen   },
  { label: "Notifications", href: ROUTES.touristNotifications, icon: Bell       },
  { label: "Profile",       href: ROUTES.touristProfile,       icon: UserCircle },
];

const PROVIDER_NAV: NavItem[] = [
  { label: "Dashboard",   href: ROUTES.providerRoot,        icon: LayoutDashboard },
  { label: "Experiences", href: ROUTES.providerExperiences, icon: Play            },
  { label: "Packages",    href: ROUTES.providerPackages,    icon: Package         },
  { label: "Bookings",    href: ROUTES.providerBookings,    icon: CalendarCheck   },
  { label: "Profile",     href: ROUTES.providerProfile,     icon: UserCircle      },
];

type TopNavbarProps = {
  onSearchOpen?: () => void;
};

export function TopNavbar({ onSearchOpen }: TopNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, clearSession } = useAuth();
  const { addToast } = useToastStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isProvider = user?.role === "provider";
  const isTourist  = user?.role === "tourist";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems: NavItem[] = isProvider
    ? PROVIDER_NAV
    : isTourist
    ? TOURIST_NAV
    : PUBLIC_NAV;

  const handleLogout = () => {
    clearSession();
    setMobileOpen(false);
    addToast({ type: "success", title: "Logged out", description: "Session cleared." });
    router.push(ROUTES.welcome);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* Main bar — transparent glass, darkens slightly on scroll */}
      <div
        className={`transition-all duration-300 border-b ${
          scrolled
            ? "bg-black/40 backdrop-blur-xl border-white/10 shadow-sm"
            : "bg-transparent backdrop-blur-sm border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <BrandLogo size="md" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}

            {onSearchOpen && (
              <button
                onClick={onSearchOpen}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <Search className="h-4 w-4 shrink-0" />
                Search
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={isProvider ? ROUTES.providerRoot : ROUTES.touristProfile}
                  className="hidden sm:flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/15 backdrop-blur-sm transition-all"
                >
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold shrink-0">
                    {user.full_name.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user.full_name.split(" ")[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.login}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>

                <Link
                  href={ROUTES.register}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-300 transition-all"
                >
                  Get Started
                </Link>
              </>
            )}

            <LanguageSwitcher />

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/15 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu — glassy dark */}
      {mobileOpen && (
        <div className="lg:hidden bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive(item.href)
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}

          {onSearchOpen && (
            <button
              onClick={() => { setMobileOpen(false); onSearchOpen(); }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
            >
              <Search className="h-4 w-4 shrink-0" />
              Search
            </button>
          )}

          {!isAuthenticated && (
            <Link
              href={ROUTES.login}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              Login
            </Link>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-white/10 transition-all text-left"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}


