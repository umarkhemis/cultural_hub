
"use client";

/**
 * AdminLayout — wraps every admin page.
 * - Role guard: redirects non-admins immediately
 * - Collapsible sidebar (desktop) + drawer (mobile)
 * - Active-tab highlighting driven by pathname
 * - Notification bell with unread count
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Globe, Eye, Package,
  BookOpen, Flag, Settings, LogOut, Menu, X,
  Bell, ChevronRight, Shield,
} from "lucide-react";
import { cn } from "@/src/utils/cn";
import { useAuth } from "@/src/hooks/useAuth";

const NAV = [
  { href: "/control",              label: "Overview",     icon: LayoutDashboard },
  { href: "/control/users",        label: "Users",        icon: Users           },
  { href: "/control/sites",        label: "Sites",        icon: Globe           },
  { href: "/control/experiences",  label: "Experiences",  icon: Eye             },
  { href: "/control/packages",     label: "Packages",     icon: Package         },
  { href: "/control/bookings",     label: "Bookings",     icon: BookOpen        },
  { href: "/control/reports",      label: "Reports",      icon: Flag, badge: 3  },
  { href: "/control/settings",     label: "Settings",     icon: Settings        },
];


export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, clearSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // ── Role guard ──────────────────────────────────────────
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/feed");
    }
    if (!user) {
      router.replace("/login?redirect=/control");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-5 py-5 border-b border-white/10",
        collapsed && !mobile && "px-3 justify-center"
      )}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400 shadow-lg shadow-amber-400/30">
          <Shield className="h-5 w-5 text-slate-900" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="text-sm font-bold text-white leading-tight">CulturalHub</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative",
                active
                  ? "bg-amber-400/15 text-amber-400 border border-amber-400/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
                collapsed && !mobile && "justify-center px-2"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300")} />
              {(!collapsed || mobile) && <span className="flex-1">{label}</span>}
              {(!collapsed || mobile) && active && (
                <ChevronRight className="h-3.5 w-3.5 text-amber-400/60" />
              )}
              {badge && (!collapsed || mobile) && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {badge}
                </span>
              )}
              {badge && collapsed && !mobile && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className={cn(
        "border-t border-white/10 p-3",
        collapsed && !mobile ? "flex justify-center" : "space-y-1"
      )}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
              {user.full_name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { clearSession(); router.replace("/login"); }}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-red-400 transition-all",
            collapsed && !mobile && "justify-center"
          )}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {(!collapsed || mobile) && "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">

      {/* ── Desktop sidebar ── */}
      <aside className={cn(
        "hidden lg:flex flex-col border-r border-white/10 bg-slate-900 shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full flex h-6 w-6 items-center justify-center rounded-r-lg bg-slate-800 border border-white/10 text-slate-400 hover:text-white z-10 transition-all"
          style={{ marginLeft: collapsed ? 64 : 240, transition: "margin 300ms" }}
        >
          <ChevronRight className={cn("h-3 w-3 transition-transform", !collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* ── Mobile drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-white/10 flex flex-col shadow-2xl">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent mobile />
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm px-4 sm:px-6 py-3.5 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden text-slate-400 hover:text-white p-1 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">
                {NAV.find(n => n.href === pathname || (n.href !== "/admin" && pathname.startsWith(n.href)))?.label ?? "Admin"}
              </h1>
              <p className="text-[10px] text-slate-500 hidden sm:block">CulturalHub Administration</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900 shrink-0">
              {user.full_name?.[0]?.toUpperCase() ?? "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}