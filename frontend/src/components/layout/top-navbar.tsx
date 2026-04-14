
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































// // frontend\src\components\layout\top-navbar.tsx

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import {
//   Menu, X, LogIn, LogOut,
//   Play, BookOpen, Bell,
//   Globe, Package, LayoutDashboard,
//   CalendarCheck, UserCircle, Search,
// } from "lucide-react";

// import { ROUTES } from "@/src/constants/routes";
// import { useAuth } from "@/src/hooks/useAuth";
// import { useToastStore } from "@/src/store/toast-store";
// import { BrandLogo } from "@/src/components/common/brand-logo";

// type NavItem = {
//   label: string;
//   href: string;
//   icon: React.ElementType;
// };

// const PUBLIC_NAV: NavItem[] = [
//   { label: "Feed",           href: ROUTES.feed,     icon: Play    },
//   { label: "Packages",       href: ROUTES.packages, icon: Package },
//   { label: "Cultural Sites", href: ROUTES.sites,    icon: Globe   },
// ];

// const TOURIST_NAV: NavItem[] = [
//   { label: "Feed",          href: ROUTES.feed,                 icon: Play       },
//   { label: "Bookings",      href: ROUTES.touristBookings,      icon: BookOpen   },
//   { label: "Notifications", href: ROUTES.touristNotifications, icon: Bell       },
//   { label: "Profile",       href: ROUTES.touristProfile,       icon: UserCircle },
// ];

// const PROVIDER_NAV: NavItem[] = [
//   { label: "Dashboard",   href: ROUTES.providerRoot,        icon: LayoutDashboard },
//   { label: "Experiences", href: ROUTES.providerExperiences, icon: Play            },
//   { label: "Packages",    href: ROUTES.providerPackages,    icon: Package         },
//   { label: "Bookings",    href: ROUTES.providerBookings,    icon: CalendarCheck   },
//   { label: "Profile",     href: ROUTES.providerProfile,     icon: UserCircle      },
// ];

// type TopNavbarProps = {
//   onSearchOpen?: () => void;
// };

// export function TopNavbar({ onSearchOpen }: TopNavbarProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { isAuthenticated, user, clearSession } = useAuth();
//   const { addToast } = useToastStore();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const isProvider = user?.role === "provider";
//   const isTourist  = user?.role === "tourist";

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const navItems: NavItem[] = isProvider
//     ? PROVIDER_NAV
//     : isTourist
//     ? TOURIST_NAV
//     : PUBLIC_NAV;

//   const handleLogout = () => {
//     clearSession();
//     setMobileOpen(false);
//     addToast({ type: "success", title: "Logged out", description: "Session cleared." });
//     router.push(ROUTES.welcome);
//   };

//   const isActive = (href: string) => pathname === href;

//   return (
//     <header className="shrink-0 z-30">

//       {/* ── Main bar ── */}
//       <div
//         className={`transition-all duration-300 ${
//           scrolled
//             ? "bg-black/80 backdrop-blur-lg border-b border-white/10 shadow-md"
//             : "bg-black/60 backdrop-blur-md border-b border-white/10"
//         }`}
//       >
//         <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

//           {/* Logo */}
//           <BrandLogo size="md" />

//           {/* Desktop nav */}
//           <nav className="hidden lg:flex items-center gap-1">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
//                   isActive(item.href)
//                     ? "bg-white/15 text-white"
//                     : "text-white/70 hover:text-white hover:bg-white/10"
//                 }`}
//               >
//                 <item.icon className="h-4 w-4 shrink-0" />
//                 {item.label}
//               </Link>
//             ))}

//             {/* Search — only when handler provided */}
//             {onSearchOpen && (
//               <button
//                 onClick={onSearchOpen}
//                 className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
//               >
//                 <Search className="h-4 w-4 shrink-0" />
//                 Search
//               </button>
//             )}
//           </nav>

//           {/* Right side */}
//           <div className="flex items-center gap-2">
//             {isAuthenticated && user ? (
//               <>
//                 <Link
//                   href={isProvider ? ROUTES.providerRoot : ROUTES.touristProfile}
//                   className="hidden sm:flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10 backdrop-blur-sm transition-all"
//                 >
//                   <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-bold shrink-0">
//                     {user.full_name.slice(0, 1).toUpperCase()}
//                   </div>
//                   <span className="max-w-[100px] truncate">{user.full_name.split(" ")[0]}</span>
//                 </Link>

//                 <button
//                   onClick={handleLogout}
//                   className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   href={ROUTES.login}
//                   className="hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
//                 >
//                   <LogIn className="h-4 w-4" />
//                   Login
//                 </Link>

//                 <Link
//                   href={ROUTES.register}
//                   className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-300 transition-all"
//                 >
//                   Get Started
//                 </Link>
//               </>
//             )}

//             {/* Mobile toggle */}
//             <button
//               type="button"
//               onClick={() => setMobileOpen((v) => !v)}
//               className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all"
//               aria-label="Toggle menu"
//             >
//               {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile menu ── */}
//       {mobileOpen && (
//         <div className="lg:hidden bg-black/90 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex flex-col gap-1">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               onClick={() => setMobileOpen(false)}
//               className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
//                 isActive(item.href)
//                   ? "bg-white/15 text-white"
//                   : "text-white/70 hover:text-white hover:bg-white/10"
//               }`}
//             >
//               <item.icon className="h-4 w-4 shrink-0" />
//               {item.label}
//             </Link>
//           ))}

//           {onSearchOpen && (
//             <button
//               onClick={() => { setMobileOpen(false); onSearchOpen(); }}
//               className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all text-left"
//             >
//               <Search className="h-4 w-4 shrink-0" />
//               Search
//             </button>
//           )}

//           {!isAuthenticated && (
//             <Link
//               href={ROUTES.login}
//               onClick={() => setMobileOpen(false)}
//               className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
//             >
//               <LogIn className="h-4 w-4 shrink-0" />
//               Login
//             </Link>
//           )}

//           {isAuthenticated && (
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-white/10 transition-all text-left"
//             >
//               <LogOut className="h-4 w-4 shrink-0" />
//               Logout
//             </button>
//           )}
//         </div>
//       )}
//     </header>
//   );
// }






























// // // frontend\src\components\layout\top-navbar.tsx

// // "use client";

// // import Link from "next/link";
// // import { usePathname, useRouter } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import {
// //   Menu, X, LogIn, LogOut,
// //   Play, BookOpen, Bell, User,
// //   Globe, Package, LayoutDashboard,
// //   Briefcase, CalendarCheck, UserCircle, Search,
// // } from "lucide-react";

// // import { ROUTES } from "@/src/constants/routes";
// // import { useAuth } from "@/src/hooks/useAuth";
// // import { useToastStore } from "@/src/store/toast-store";
// // import { BrandLogo } from "@/src/components/common/brand-logo";

// // type NavItem = {
// //   label: string;
// //   href: string;
// //   icon: React.ElementType;
// //   touristOnly?: boolean;
// //   providerOnly?: boolean;
// //   authOnly?: boolean;
// // };

// // // ── All nav items by context ──────────────────
// // const PUBLIC_NAV: NavItem[] = [
// //   { label: "Feed",          href: ROUTES.feed,     icon: Play    },
// //   { label: "Packages",      href: ROUTES.packages, icon: Package },
// //   { label: "Cultural Sites",href: ROUTES.sites,    icon: Globe   },
// // ];

// // const TOURIST_NAV: NavItem[] = [
// //   { label: "Feed",          href: ROUTES.feed,                  icon: Play,          },
// //   { label: "Bookings",      href: ROUTES.touristBookings,       icon: BookOpen,      touristOnly: true },
// //   { label: "Notifications", href: ROUTES.touristNotifications,  icon: Bell,          touristOnly: true },
// //   { label: "Profile",       href: ROUTES.touristProfile,        icon: UserCircle,    touristOnly: true },
// // ];

// // const PROVIDER_NAV: NavItem[] = [
// //   { label: "Dashboard",   href: ROUTES.providerRoot,         icon: LayoutDashboard, providerOnly: true },
// //   { label: "Experiences", href: ROUTES.providerExperiences,  icon: Play,            providerOnly: true },
// //   { label: "Packages",    href: ROUTES.providerPackages,     icon: Package,         providerOnly: true },
// //   { label: "Bookings",    href: ROUTES.providerBookings,     icon: CalendarCheck,   providerOnly: true },
// //   { label: "Profile",     href: ROUTES.providerProfile,      icon: UserCircle,      providerOnly: true },
// // ];

// // type TopNavbarProps = {
// //   /** Pass true when used inside FeedLayout — disables scroll effect, uses light bg */
// //   feedMode?: boolean;
// //   onSearchOpen?: () => void;
// // };

// // export function TopNavbar({ feedMode = false, onSearchOpen }: TopNavbarProps) {
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const { isAuthenticated, user, clearSession } = useAuth();
// //   const { addToast } = useToastStore();
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [scrolled, setScrolled] = useState(false);

// //   const isProvider = user?.role === "provider";
// //   const isTourist  = user?.role === "tourist";

// //   // Scroll effect — only in non-feed (overlay) mode
// //   useEffect(() => {
// //     if (feedMode) return;
// //     const onScroll = () => setScrolled(window.scrollY > 20);
// //     window.addEventListener("scroll", onScroll);
// //     return () => window.removeEventListener("scroll", onScroll);
// //   }, [feedMode]);

// //   // Resolve which nav items to show
// //   const navItems: NavItem[] = isProvider
// //     ? PROVIDER_NAV
// //     : isTourist
// //     ? TOURIST_NAV
// //     : PUBLIC_NAV;

// //   const handleLogout = () => {
// //     clearSession();
// //     setMobileOpen(false);
// //     addToast({ type: "success", title: "Logged out", description: "Session cleared." });
// //     router.push(ROUTES.welcome);
// //   };

// //   // ── Styles based on mode ──────────────────
// //   const headerBase = feedMode
// //     ? "h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30"
// //     : `transition-all duration-300 ${
// //         scrolled
// //           ? "backdrop-blur-lg bg-black/70 border-b border-white/10 shadow-md"
// //           : "backdrop-blur-md bg-black/20 border-b border-white/10"
// //       }`;

// //   const linkBase = feedMode
// //     ? "flex items-center gap-2 rounded-xl px-2.5 sm:px-3.5 py-2 text-sm font-medium transition-all"
// //     : "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all";

// //   const activeFeed    = "bg-amber-50 text-amber-600";
// //   const inactiveFeed  = "text-stone-500 hover:bg-stone-100 hover:text-stone-800";
// //   const activeOverlay = "bg-white/15 text-white";
// //   const inactiveOverlay = "text-white/80 hover:text-white hover:bg-white/10";

// //   const linkActive   = (href: string) => pathname === href
// //     ? (feedMode ? activeFeed : activeOverlay)
// //     : (feedMode ? inactiveFeed : inactiveOverlay);

// //   const iconColor = feedMode ? "" : "text-white/70";

// //   return (
// //     <header className={feedMode ? "" : "fixed top-0 left-0 right-0 z-50"}>
// //       <div className={headerBase}>
// //         <div className={feedMode ? "contents" : "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full"}>

// //           {/* Logo */}
// //           <BrandLogo size="md" />

// //           {/* Desktop nav */}
// //           <nav className={`hidden items-center gap-1 ${feedMode ? "flex" : "lg:flex"}`}>
// //             {navItems.map((item) => (
// //               <Link
// //                 key={item.href}
// //                 href={item.href}
// //                 className={`${linkBase} ${linkActive(item.href)}`}
// //               >
// //                 <item.icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
// //                 <span className={feedMode ? "hidden sm:block" : ""}>{item.label}</span>
// //               </Link>
// //             ))}

// //             {/* Search button - feed mode only */}
// //             {feedMode && onSearchOpen && (
// //               <button
// //                 onClick={onSearchOpen}
// //                 className={`${linkBase} ${inactiveFeed}`}
// //               >
// //                 <Search className="h-4 w-4 shrink-0" />
// //                 <span className="hidden sm:block">Search</span>
// //               </button>
// //             )}
// //           </nav>

// //           {/* Right side */}
// //           <div className="flex items-center gap-2">
// //             {isAuthenticated && user ? (
// //               <>
// //                 {/* Avatar + name */}
// //                 <Link
// //                   href={isProvider ? ROUTES.providerRoot : ROUTES.touristProfile}
// //                   className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all ${
// //                     feedMode
// //                       ? "border border-stone-200 text-stone-700 hover:bg-stone-100"
// //                       : "border border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
// //                   }`}
// //                 >
// //                   <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
// //                     feedMode ? "bg-amber-100 text-amber-700" : "bg-white/20 text-white"
// //                   }`}>
// //                     {user.full_name.slice(0, 1).toUpperCase()}
// //                   </div>
// //                   <span className="max-w-[100px] truncate">{user.full_name.split(" ")[0]}</span>
// //                 </Link>

// //                 {/* Logout */}
// //                 <button
// //                   onClick={handleLogout}
// //                   className={`hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
// //                     feedMode
// //                       ? "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
// //                       : "text-white/80 hover:text-white hover:bg-white/10"
// //                   }`}
// //                 >
// //                   <LogOut className="h-4 w-4" />
// //                   <span>Logout</span>
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 <Link
// //                   href={ROUTES.login}
// //                   className={`hidden sm:flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
// //                     feedMode
// //                       ? "text-stone-500 hover:bg-stone-100"
// //                       : "text-white/80 hover:text-white hover:bg-white/10"
// //                   }`}
// //                 >
// //                   <LogIn className="h-4 w-4" />
// //                   Login
// //                 </Link>

// //                 <Link
// //                   href={ROUTES.register}
// //                   className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
// //                     feedMode
// //                       ? "bg-amber-400 text-stone-900 hover:bg-amber-300"
// //                       : "bg-white text-slate-900 hover:bg-white/90"
// //                   }`}
// //                 >
// //                   Get Started
// //                 </Link>
// //               </>
// //             )}

// //             {/* Mobile toggle */}
// //             <button
// //               type="button"
// //               onClick={() => setMobileOpen((v) => !v)}
// //               className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
// //                 feedMode
// //                   ? "border border-stone-200 text-stone-500 hover:bg-stone-100 lg:hidden"
// //                   : "border border-white/20 text-white hover:bg-white/10 lg:hidden"
// //               }`}
// //               aria-label="Toggle menu"
// //             >
// //               {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile menu */}
// //       {mobileOpen && (
// //         <div className={`lg:hidden border-t px-4 py-3 flex flex-col gap-1 z-20 shrink-0 ${
// //           feedMode
// //             ? "bg-white border-stone-200 shadow-sm"
// //             : "bg-black/80 border-white/10 backdrop-blur-lg"
// //         }`}>
// //           {navItems.map((item) => (
// //             <Link
// //               key={item.href}
// //               href={item.href}
// //               onClick={() => setMobileOpen(false)}
// //               className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${linkActive(item.href)}`}
// //             >
// //               <item.icon className="h-4 w-4 shrink-0" />
// //               {item.label}
// //             </Link>
// //           ))}

// //           {feedMode && onSearchOpen && (
// //             <button
// //               onClick={() => { setMobileOpen(false); onSearchOpen(); }}
// //               className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left ${inactiveFeed}`}
// //             >
// //               <Search className="h-4 w-4 shrink-0" />
// //               Search
// //             </button>
// //           )}

// //           {!isAuthenticated && (
// //             <Link
// //               href={ROUTES.login}
// //               onClick={() => setMobileOpen(false)}
// //               className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
// //                 feedMode ? inactiveFeed : inactiveOverlay
// //               }`}
// //             >
// //               <LogIn className="h-4 w-4 shrink-0" />
// //               Login
// //             </Link>
// //           )}

// //           {isAuthenticated && (
// //             <button
// //               onClick={handleLogout}
// //               className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all text-left ${
// //                 feedMode ? "text-red-500 hover:bg-red-50" : "text-red-400 hover:bg-white/10"
// //               }`}
// //             >
// //               <LogOut className="h-4 w-4 shrink-0" />
// //               Logout
// //             </button>
// //           )}
// //         </div>
// //       )}
// //     </header>
// //   );
// // }





























// // // // frontend\src\components\layout\top-navbar.tsx

// // // "use client";

// // // import Link from "next/link";
// // // import { Menu, X, User } from "lucide-react";
// // // import { useEffect, useState } from "react";
// // // import { useRouter } from "next/navigation";
// // // import Image from "next/image";

// // // import { ROUTES } from "@/src/constants/routes";
// // // import { Button } from "@/src/components/ui/button";
// // // import { useAuth } from "@/src/hooks/useAuth";
// // // import { useToastStore } from "@/src/store/toast-store";
// // // import { BrandLogo } from "@/src/components/common/brand-logo";

// // // export function TopNavbar() {
// // //   const router = useRouter();
// // //   const { isAuthenticated, user, clearSession } = useAuth();
// // //   const { addToast } = useToastStore();
// // //   const [open, setOpen] = useState(false);
// // //   const [scrolled, setScrolled] = useState(false);

// // //   useEffect(() => {
// // //     const handleScroll = () => {
// // //       setScrolled(window.scrollY > 20);
// // //     };
// // //     window.addEventListener("scroll", handleScroll);
// // //     return () => window.removeEventListener("scroll", handleScroll);
// // //   }, []);

// // //   const baseLinks = [
// // //     { label: "Explore", href: ROUTES.feed },
// // //     { label: "Packages", href: ROUTES.packages },
// // //     { label: "Cultural Sites", href: ROUTES.sites },
// // //   ];

// // //   const touristLinks = [
// // //     { label: "My Bookings", href: ROUTES.touristBookings },
// // //     { label: "Notifications", href: ROUTES.touristNotifications },
// // //     { label: "Profile", href: ROUTES.touristProfile },
// // //   ];

// // //   const providerLinks = [
// // //     { label: "Dashboard", href: ROUTES.providerRoot },
// // //     { label: "Experiences", href: ROUTES.providerExperiences },
// // //     { label: "Packages", href: ROUTES.providerPackages },
// // //     { label: "Bookings", href: ROUTES.providerBookings },
// // //     { label: "Profile", href: ROUTES.providerProfile },
// // //   ];

// // //   const isProvider = user?.role === "provider";

// // //   const roleLinks = isProvider
// // //     ? providerLinks
// // //     : user?.role === "tourist"
// // //     ? touristLinks
// // //     : [];

// // //   const visibleBaseLinks = isProvider ? [] : baseLinks;
// // //   const mobileLinks = [...visibleBaseLinks, ...roleLinks];

// // //   const handleLogout = () => {
// // //     clearSession();
// // //     setOpen(false);
// // //     addToast({
// // //       type: "success",
// // //       title: "Logged out",
// // //       description: "Your session has been cleared successfully.",
// // //     });
// // //     router.push(ROUTES.welcome);
// // //   };

// // //   return (
// // //     <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">

// // //       <div
// // //         className={`transition-all duration-300 ${
// // //           scrolled
// // //             ? "backdrop-blur-lg bg-black/70 border-b border-white/10 shadow-md"
// // //             : "backdrop-blur-md bg-black/20 border-b border-white/10"
// // //         }`}
// // //       >
// // //         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">


// // //           {/* ── Logo ── */}
// // //           <BrandLogo size="md" />

// // //           {/* Desktop Nav */}
// // //           <nav className="hidden items-center gap-6 lg:flex">
// // //             {visibleBaseLinks.map((item) => (
// // //               <Link
// // //                 key={item.href}
// // //                 href={item.href}
// // //                 className="text-sm text-white/80 hover:text-white transition"
// // //               >
// // //                 {item.label}
// // //               </Link>
// // //             ))}
// // //             {roleLinks.map((item) => (
// // //               <Link
// // //                 key={item.href}
// // //                 href={item.href}
// // //                 className="text-sm text-white/80 hover:text-white transition"
// // //               >
// // //                 {item.label}
// // //               </Link>
// // //             ))}
// // //           </nav>

// // //           {/* Right Actions */}
// // //           <div className="flex items-center gap-2">
// // //             {isAuthenticated && user ? (
// // //               <>
// // //                 <Link
// // //                   href={isProvider ? ROUTES.providerRoot : ROUTES.touristProfile}
// // //                   className="hidden items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-white hover:bg-white/10 sm:inline-flex backdrop-blur-sm"
// // //                 >
// // //                   <User className="h-4 w-4" />
// // //                   {user.full_name.split(" ")[0]}
// // //                 </Link>

// // //                 <Button
// // //                   variant="ghost"
// // //                   onClick={handleLogout}
// // //                   className="text-white hover:bg-white/10"
// // //                 >
// // //                   Logout
// // //                 </Button>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Link href={ROUTES.login} className="hidden sm:block">
// // //                   <Button variant="ghost" className="text-white hover:bg-white/10">
// // //                     Login
// // //                   </Button>
// // //                 </Link>

// // //                 <Link href={ROUTES.register}>
// // //                   <Button className="bg-white text-slate-900 hover:bg-white/90 font-semibold">
// // //                     Get Started
// // //                   </Button>
// // //                 </Link>
// // //               </>
// // //             )}

// // //             {/* Mobile Menu Button */}
// // //             <button
// // //               type="button"
// // //               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-white lg:hidden"
// // //               aria-label="Open menu"
// // //               onClick={() => setOpen((v) => !v)}
// // //             >
// // //               {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
// // //             </button>
// // //           </div>

// // //         </div>
// // //       </div>

// // //       {/* Mobile Menu */}
// // //       {open && (
// // //         <div className="border-t border-white/10 bg-black/80 backdrop-blur-lg lg:hidden">
// // //           <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
// // //             {mobileLinks.map((item) => (
// // //               <Link
// // //                 key={item.href}
// // //                 href={item.href}
// // //                 className="rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition"
// // //                 onClick={() => setOpen(false)}
// // //               >
// // //                 {item.label}
// // //               </Link>
// // //             ))}

// // //             {!isAuthenticated && (
// // //               <Link
// // //                 href={ROUTES.login}
// // //                 className="rounded-xl px-3 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white"
// // //                 onClick={() => setOpen(false)}
// // //               >
// // //                 Login
// // //               </Link>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </header>
// // //   );
// // // }


