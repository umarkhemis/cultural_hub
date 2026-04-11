
// cultural_hub\frontend\src\components\feed\FeedLayout.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Play, BookOpen, Bell, User, Globe,
  Package, LogIn, Search, Menu, X,
} from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";
import { SearchOverlay } from "./SearchOverlay";

const NAV_ITEMS = [
  { label: "Feed", href: ROUTES.feed ?? "/", icon: Play },
  { label: "Bookings", href: ROUTES.touristBookings, icon: BookOpen, touristOnly: true },
  { label: "Notifications", href: "/notifications", icon: Bell, authOnly: true },
  { label: "Profile", href: "/profile", icon: User, authOnly: true },
];

export function FeedLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (item.touristOnly && user?.role !== "tourist") return false;
    if (item.authOnly && !isAuthenticated) return false;
    return true;
  });

  return (
    <div className="h-screen bg-stone-100 flex flex-col overflow-hidden">

      {/* ── Top Navbar ── */}
      <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">

        {/* Logo */}
        <Link href={ROUTES.welcome} className="flex items-center gap-2.5">
          <img
            src="/mock/logo_cultural_hub-bg.png"
            alt="CulturalHub"
            className="h-8 w-8 object-contain shrink-0"
          />
          <span className="text-sm font-bold text-amber-500 tracking-wide hidden sm:block">
            CulturalHub
          </span>
        </Link>

        {/* Nav links — always visible, icons only on mobile */}
        <nav className="flex items-center gap-1">
          {visibleNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-2.5 sm:px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-50 text-amber-600"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:block">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <Link
              href={ROUTES.login}
              className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-300 transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:block">Sign in</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                {user?.full_name?.slice(0, 1).toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block text-xs font-medium text-stone-600 max-w-[100px] truncate">
                {user?.full_name}
              </span>
            </div>
          )}

          {/* Hamburger — mobile only, opens sidebar content */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-100 transition-all"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* ── Mobile sidebar dropdown — sidebar content only ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 flex flex-col gap-4 z-20 shrink-0 shadow-sm">

          {/* Search */}
          <button
            onClick={() => { setMobileMenuOpen(false); setShowSearch(true); }}
            className="flex items-center gap-2.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-all text-left"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search sites, experiences...</span>
          </button>

          {/* Packages */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              Packages
            </p>
            <Link
              href={ROUTES.packages}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 shrink-0">
                <Package className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Browse Packages</p>
                <p className="text-xs text-stone-400">Tourism packages</p>
              </div>
            </Link>
          </div>

          {/* Sites */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              Cultural Sites
            </p>
            <Link
              href={ROUTES.sites}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
                <Globe className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Explore Sites</p>
                <p className="text-xs text-stone-400">Cultural heritage</p>
              </div>
            </Link>
          </div>

          {/* Sign in CTA — guests only */}
          {!isAuthenticated && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4">
              <p className="text-sm font-semibold text-stone-800 mb-1">Join CulturalHub</p>
              <p className="text-xs text-stone-500 mb-3">Like, comment and follow cultural sites.</p>
              <Link
                href={ROUTES.login}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Body: sidebar + feed ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar — desktop only ── */}
        <aside className="hidden lg:flex w-72 h-full overflow-y-auto bg-white border-r border-stone-200 flex-col px-4 py-5 gap-5 shrink-0">

          {/* Search */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-all text-left"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search sites, experiences...</span>
          </button>

          {/* Packages */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
              Packages
            </p>
            <div className="space-y-2">
              <Link
                href={ROUTES.packages}
                className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 shrink-0">
                  <Package className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Browse Packages</p>
                  <p className="text-xs text-stone-400">Tourism packages</p>
                </div>
              </Link>
              <Link
                href={ROUTES.packages}
                className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1"
              >
                See more →
              </Link>
            </div>
          </div>

          {/* Sites */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
              Cultural Sites
            </p>
            <div className="space-y-2">
              <Link
                href={ROUTES.sites}
                className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
                  <Globe className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Explore Sites</p>
                  <p className="text-xs text-stone-400">Cultural heritage</p>
                </div>
              </Link>
              <Link
                href={ROUTES.sites}
                className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1"
              >
                See more →
              </Link>
            </div>
          </div>

          {/* Sign in CTA */}
          {!isAuthenticated && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4">
              <p className="text-sm font-semibold text-stone-800 mb-1">Join CulturalHub</p>
              <p className="text-xs text-stone-500 mb-3">Like, comment and follow cultural sites.</p>
              <Link
                href={ROUTES.login}
                className="block w-full text-center rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
              >
                Sign in
              </Link>
            </div>
          )}
        </aside>

        {/* ── Center feed ── */}
        <main className="flex-1 h-full overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-50">
          <SearchOverlay onClose={() => setShowSearch(false)} />
        </div>
      )}
    </div>
  );
}
































// // cultural_hub\frontend\src\components\feed\FeedLayout.tsx

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   Play, BookOpen, Bell, User, Globe,
//   Package, LogIn, Search, Menu, X,
// } from "lucide-react";

// import { useAuth } from "@/src/hooks/useAuth";
// import { ROUTES } from "@/src/constants/routes";
// import { SearchOverlay } from "./SearchOverlay";

// const NAV_ITEMS = [
//   { label: "Feed", href: ROUTES.feed ?? "/", icon: Play },
//   { label: "Bookings", href: ROUTES.touristBookings, icon: BookOpen, touristOnly: true },
//   { label: "Notifications", href: "/notifications", icon: Bell, authOnly: true },
//   { label: "Profile", href: "/profile", icon: User, authOnly: true },
// ];

// export function FeedLayout({ children }: { children: React.ReactNode }) {
//   const { user, isAuthenticated } = useAuth();
//   const pathname = usePathname();
//   const [showSearch, setShowSearch] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const visibleNav = NAV_ITEMS.filter((item) => {
//     if (item.touristOnly && user?.role !== "tourist") return false;
//     if (item.authOnly && !isAuthenticated) return false;
//     return true;
//   });

//   return (
//     <div className="h-screen bg-stone-100 flex flex-col overflow-hidden">

//       {/* ── Top Navbar ── */}
//       <header className="h-14 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">

//         {/* Logo */}
//         <Link
//           href={ROUTES.welcome}
//           className="flex items-center gap-2.5"
//         >
//           <img
//             src="/mock/logo_cultural_hub-bg.png"
//             alt="CulturalHub"
//             className="h-8 w-8 object-contain shrink-0"
//           />
//           <span className="text-sm font-bold text-amber-500 tracking-wide hidden sm:block">
//             CulturalHub
//           </span>
//         </Link>

//         {/* Desktop nav links — center */}
//         <nav className="hidden md:flex items-center gap-1">
//           {visibleNav.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all ${
//                   isActive
//                     ? "bg-amber-50 text-amber-600"
//                     : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
//                 }`}
//               >
//                 <item.icon className="h-4 w-4 shrink-0" />
//                 {item.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Right side: sign in + mobile menu toggle */}
//         <div className="flex items-center gap-2">
//           {!isAuthenticated ? (
//             <Link
//               href={ROUTES.login}
//               className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-300 transition-all"
//             >
//               <LogIn className="h-4 w-4" />
//               <span className="hidden sm:block">Sign in</span>
//             </Link>
//           ) : (
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
//                 {user?.full_name?.slice(0, 1).toUpperCase() ?? "U"}
//               </div>
//               <span className="hidden sm:block text-xs font-medium text-stone-600 max-w-[100px] truncate">
//                 {user?.full_name}
//               </span>
//             </div>
//           )}

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setMobileMenuOpen((v) => !v)}
//             className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-stone-500 hover:bg-stone-100 transition-all"
//           >
//             {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//           </button>
//         </div>
//       </header>

//       {/* ── Mobile dropdown menu ── */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex flex-col gap-1 z-20 shrink-0">

//           {/* Nav links */}
//           {visibleNav.map((item) => {
//             const isActive = pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 onClick={() => setMobileMenuOpen(false)}
//                 className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
//                   isActive
//                     ? "bg-amber-50 text-amber-600"
//                     : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
//                 }`}
//               >
//                 <item.icon className="h-4 w-4 shrink-0" />
//                 {item.label}
//               </Link>
//             );
//           })}

//           {/* Divider */}
//           <div className="my-1 border-t border-stone-100" />

//           {/* Search */}
//           <button
//             onClick={() => { setMobileMenuOpen(false); setShowSearch(true); }}
//             className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 transition-all text-left"
//           >
//             <Search className="h-4 w-4 shrink-0 text-stone-400" />
//             Search sites &amp; experiences
//           </button>

//           {/* Packages */}
//           <Link
//             href={ROUTES.packages}
//             onClick={() => setMobileMenuOpen(false)}
//             className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 transition-all"
//           >
//             <Package className="h-4 w-4 shrink-0 text-amber-500" />
//             Packages
//           </Link>

//           {/* Sites */}
//           <Link
//             href={ROUTES.sites}
//             onClick={() => setMobileMenuOpen(false)}
//             className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 transition-all"
//           >
//             <Globe className="h-4 w-4 shrink-0 text-emerald-500" />
//             Cultural Sites
//           </Link>
//         </div>
//       )}

//       {/* ── Body: sidebar + feed ── */}
//       <div className="flex flex-1 overflow-hidden">

//         {/* ── Left sidebar (search, packages, sites) ── */}
//         <aside className="hidden lg:flex w-72 h-full overflow-y-auto bg-white border-r border-stone-200 flex-col px-4 py-5 gap-5 shrink-0">

//           {/* Search */}
//           <button
//             onClick={() => setShowSearch(true)}
//             className="flex items-center gap-2.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-all text-left"
//           >
//             <Search className="h-4 w-4 shrink-0" />
//             <span>Search sites, experiences...</span>
//           </button>

//           {/* Packages */}
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
//               Packages
//             </p>
//             <div className="space-y-2">
//               <Link
//                 href={ROUTES.packages}
//                 className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
//               >
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 shrink-0">
//                   <Package className="h-4 w-4 text-amber-600" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Browse Packages</p>
//                   <p className="text-xs text-stone-400">Tourism packages</p>
//                 </div>
//               </Link>
//               <Link
//                 href={ROUTES.packages}
//                 className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1"
//               >
//                 See more →
//               </Link>
//             </div>
//           </div>

//           {/* Sites */}
//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
//               Cultural Sites
//             </p>
//             <div className="space-y-2">
//               <Link
//                 href={ROUTES.sites}
//                 className="flex items-center gap-3 rounded-xl border border-stone-100 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
//               >
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
//                   <Globe className="h-4 w-4 text-emerald-600" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Explore Sites</p>
//                   <p className="text-xs text-stone-400">Cultural heritage</p>
//                 </div>
//               </Link>
//               <Link
//                 href={ROUTES.sites}
//                 className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1"
//               >
//                 See more →
//               </Link>
//             </div>
//           </div>

//           {/* Sign in CTA */}
//           {!isAuthenticated && (
//             <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4">
//               <p className="text-sm font-semibold text-stone-800 mb-1">Join CulturalHub</p>
//               <p className="text-xs text-stone-500 mb-3">Like, comment and follow cultural sites.</p>
//               <Link
//                 href={ROUTES.login}
//                 className="block w-full text-center rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
//               >
//                 Sign in
//               </Link>
//             </div>
//           )}
//         </aside>

//         {/* ── Center feed ── */}
//         <main className="flex-1 h-full overflow-y-auto">
//           <div className="max-w-2xl mx-auto px-4 py-6">
//             {children}
//           </div>
//         </main>
//       </div>

//       {/* Search overlay */}
//       {showSearch && (
//         <div className="fixed inset-0 z-50">
//           <SearchOverlay onClose={() => setShowSearch(false)} />
//         </div>
//       )}
//     </div>
//   );
// }

