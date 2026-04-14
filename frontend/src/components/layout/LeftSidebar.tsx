"use client";

import { usePathname } from "next/navigation";
import { Home, Bell, User, Compass, LogIn } from "lucide-react";

import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/hooks/useAuth";
import { cn } from "@/src/utils/cn";
import { BrandLogo } from "@/src/components/common/brand-logo";

export function LeftSidebar() {
  const pathname = usePathname();
  const { isAuthenticated, hasHydrated } = useAuth();

  const authed = hasHydrated ? isAuthenticated : false;

  const homeHref = ROUTES.feed;
  const exploreHref = ROUTES.sites;
  const notificationsHref = authed ? ROUTES.touristNotifications : ROUTES.login;
  const profileHref = authed ? ROUTES.touristProfile : ROUTES.login;

  return (
    <div className="flex h-full w-full flex-col px-4 py-6">
      {/* LOGO */}
      <div className="mb-8 px-2">
        <BrandLogo
          href={homeHref}
          size="md"
          showTagline={false}
          logoShape="circle"
          className="rounded-2xl px-2 py-2 hover:bg-black/5 transition"
        />
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2">
        <SidebarItem
          pathname={pathname}
          href={homeHref}
          icon={<Home className="h-5 w-5" />}
          label="Home"
        />

        <SidebarItem
          pathname={pathname}
          href={exploreHref}
          icon={<Compass className="h-5 w-5" />}
          label="Explore Sites"
        />

        <SidebarItem
          pathname={pathname}
          href={notificationsHref}
          icon={<Bell className="h-5 w-5" />}
          label="Notifications"
          disabled={!authed && hasHydrated}
          hint={!authed && hasHydrated ? "Login required" : undefined}
        />

        <SidebarItem
          pathname={pathname}
          href={profileHref}
          icon={<User className="h-5 w-5" />}
          label="Profile"
          disabled={!authed && hasHydrated}
          hint={!authed && hasHydrated ? "Login required" : undefined}
        />

        {!authed && hasHydrated ? (
          <SidebarItem
            pathname={pathname}
            href={ROUTES.login}
            icon={<LogIn className="h-5 w-5" />}
            label="Login"
          />
        ) : null}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto px-2 text-xs text-slate-400">
        © {new Date().getFullYear()} CulturalHub
      </div>
    </div>
  );
}

function SidebarItem({
  pathname,
  href,
  icon,
  label,
  disabled,
  hint,
}: {
  pathname: string | null;
  href: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  hint?: string;
}) {
  const isActive =
    !!pathname &&
    (pathname === href || (href !== ROUTES.home && pathname.startsWith(href)));

  return (
    <a
      href={href}
      aria-disabled={disabled ? "true" : undefined}
      title={hint}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        isActive
          ? "bg-black/5 text-slate-900"
          : "text-slate-700 hover:bg-black/5 hover:text-slate-900",
        disabled ? "opacity-70 pointer-events-none" : ""
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </a>
  );
}