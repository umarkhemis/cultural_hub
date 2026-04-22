
"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Package, LogIn, Search } from "lucide-react";

import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/constants/routes";
import { TopNavbar } from "@/src/components/layout/top-navbar";
import { SearchOverlay } from "./SearchOverlay";

export function FeedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  const sidebarExtras = (
    <>
      {/* Packages */}
      <div className="px-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 mb-1">
          Packages
        </p>
        <Link
          href={ROUTES.packages}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Package className="h-4 w-4 shrink-0 text-amber-400" />
          Browse Packages
        </Link>
      </div>

      {/* Cultural Sites */}
      <div className="px-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 mb-1">
          Cultural Sites
        </p>
        <Link
          href={ROUTES.sites}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <Globe className="h-4 w-4 shrink-0 text-emerald-400" />
          Explore Sites
        </Link>
      </div>

      {/* Sign in CTA — guests only */}
      {!isAuthenticated && (
        <div className="mx-1 mt-1 rounded-2xl bg-amber-500/10 border border-amber-400/20 px-4 py-3">
          <p className="text-sm font-semibold text-white mb-0.5">Join CulturalHub</p>
          <p className="text-xs text-white/50 mb-3">Like, comment and follow cultural sites.</p>
          <Link
            href={ROUTES.login}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-stone-100">

      {/* No more separate dark strip — navbar is consistently stone-900 */}
      <TopNavbar
        onSearchOpen={() => setShowSearch(true)}
        mobileExtras={sidebarExtras}
      />

      <div className="flex h-[calc(100vh-3.5rem)] mt-14">

        {/* Left sidebar — desktop only */}
        <aside className="hidden lg:flex w-72 h-full overflow-y-auto flex-col px-4 py-5 gap-5 shrink-0 bg-white border-r border-stone-200">

          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-all text-left"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span>Search sites, experiences...</span>
          </button>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
              Packages
            </p>
            <div className="space-y-2">
              <Link
                href={ROUTES.packages}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 shrink-0">
                  <Package className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Browse Packages</p>
                  <p className="text-xs text-stone-400">Tourism packages</p>
                </div>
              </Link>
              <Link href={ROUTES.packages} className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1">
                See more →
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
              Cultural Sites
            </p>
            <div className="space-y-2">
              <Link
                href={ROUTES.sites}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
                  <Globe className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 group-hover:text-emerald-700">Explore Sites</p>
                  <p className="text-xs text-stone-400">Cultural heritage</p>
                </div>
              </Link>
              <Link href={ROUTES.sites} className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1">
                See more →
              </Link>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4">
              <p className="text-sm font-semibold text-stone-800 mb-1">Join CulturalHub</p>
              <p className="text-xs text-stone-500 mb-3">Like, comment and follow cultural sites.</p>
              <Link
                href={ROUTES.login}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
            </div>
          )}
        </aside>

        <main className="flex-1 h-full overflow-y-auto bg-stone-100">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>

      {showSearch && (
        <div className="fixed inset-0 z-50">
          <SearchOverlay onClose={() => setShowSearch(false)} />
        </div>
      )}
    </div>
  );
}




































// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Globe, Package, LogIn, Search } from "lucide-react";

// import { useAuth } from "@/src/hooks/useAuth";
// import { ROUTES } from "@/src/constants/routes";
// import { TopNavbar } from "@/src/components/layout/top-navbar";
// import { SearchOverlay } from "./SearchOverlay";

// export function FeedLayout({ children }: { children: React.ReactNode }) {
//   const { isAuthenticated } = useAuth();
//   const [showSearch, setShowSearch] = useState(false);

//   const sidebarExtras = (
//     <>
//       {/* Packages */}
//       <div className="px-3 pt-2 pb-1">
//         <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
//           Packages
//         </p>
//         <Link
//           href={ROUTES.packages}
//           className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
//         >
//           <Package className="h-4 w-4 shrink-0 text-amber-400" />
//           Browse Packages
//         </Link>
//       </div>

//       {/* Cultural Sites */}
//       <div className="px-3 pb-1">
//         <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
//           Cultural Sites
//         </p>
//         <Link
//           href={ROUTES.sites}
//           className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
//         >
//           <Globe className="h-4 w-4 shrink-0 text-emerald-400" />
//           Explore Sites
//         </Link>
//       </div>

//       {/* Sign in CTA — guests only */}
//       {!isAuthenticated && (
//         <div className="mx-3 mt-2 rounded-2xl bg-amber-500/10 border border-amber-400/20 px-4 py-3">
//           <p className="text-sm font-semibold text-white mb-0.5">Join CulturalHub</p>
//           <p className="text-xs text-white/50 mb-3">Like, comment and follow cultural sites.</p>
//           <Link
//             href={ROUTES.login}
//             className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
//           >
//             <LogIn className="h-4 w-4" />
//             Sign in
//           </Link>
//         </div>
//       )}
//     </>
//   );

//   return (
//     <div className="min-h-screen bg-stone-100">
//       <div className="fixed top-0 left-0 right-0 h-14 bg-stone-900 z-40" />

//       <TopNavbar
//         onSearchOpen={() => setShowSearch(true)}
//         mobileExtras={sidebarExtras}
//       />

//       <div className="flex h-[calc(100vh-3.5rem)] mt-14">

//         {/* Left sidebar — desktop only */}
//         <aside className="hidden lg:flex w-72 h-full overflow-y-auto flex-col px-4 py-5 gap-5 shrink-0 bg-white border-r border-stone-200">

//           <button
//             onClick={() => setShowSearch(true)}
//             className="flex items-center gap-2.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-all text-left"
//           >
//             <Search className="h-4 w-4 shrink-0" />
//             <span>Search sites, experiences...</span>
//           </button>

//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
//               Packages
//             </p>
//             <div className="space-y-2">
//               <Link
//                 href={ROUTES.packages}
//                 className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
//               >
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 shrink-0">
//                   <Package className="h-4 w-4 text-amber-600" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Browse Packages</p>
//                   <p className="text-xs text-stone-400">Tourism packages</p>
//                 </div>
//               </Link>
//               <Link href={ROUTES.packages} className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1">
//                 See more →
//               </Link>
//             </div>
//           </div>

//           <div>
//             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
//               Cultural Sites
//             </p>
//             <div className="space-y-2">
//               <Link
//                 href={ROUTES.sites}
//                 className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
//               >
//                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
//                   <Globe className="h-4 w-4 text-emerald-600" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-stone-700 group-hover:text-emerald-700">Explore Sites</p>
//                   <p className="text-xs text-stone-400">Cultural heritage</p>
//                 </div>
//               </Link>
//               <Link href={ROUTES.sites} className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1">
//                 See more →
//               </Link>
//             </div>
//           </div>

//           {!isAuthenticated && (
//             <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4">
//               <p className="text-sm font-semibold text-stone-800 mb-1">Join CulturalHub</p>
//               <p className="text-xs text-stone-500 mb-3">Like, comment and follow cultural sites.</p>
//               <Link
//                 href={ROUTES.login}
//                 className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
//               >
//                 <LogIn className="h-4 w-4" />
//                 Sign in
//               </Link>
//             </div>
//           )}
//         </aside>

//         <main className="flex-1 h-full overflow-y-auto bg-stone-100">
//           <div className="max-w-2xl mx-auto px-4 py-6">
//             {children}
//           </div>
//         </main>
//       </div>

//       {showSearch && (
//         <div className="fixed inset-0 z-50">
//           <SearchOverlay onClose={() => setShowSearch(false)} />
//         </div>
//       )}
//     </div>
//   );
// }






































// // // cultural_hub\frontend\src\components\feed\FeedLayout.tsx

// // "use client";

// // import { useState } from "react";
// // import Link from "next/link";
// // import { Globe, Package, LogIn, Search } from "lucide-react";

// // import { useAuth } from "@/src/hooks/useAuth";
// // import { ROUTES } from "@/src/constants/routes";
// // import { TopNavbar } from "@/src/components/layout/top-navbar";
// // import { SearchOverlay } from "./SearchOverlay";

// // export function FeedLayout({ children }: { children: React.ReactNode }) {
// //   const { isAuthenticated } = useAuth();
// //   const [showSearch, setShowSearch] = useState(false);

// //   return (
// //     <div className="min-h-screen bg-stone-100">

// //       {/* Dark strip behind the fixed transparent navbar so it reads correctly */}
// //       <div className="fixed top-0 left-0 right-0 h-14 bg-stone-900 z-40" />

// //       {/* Fixed transparent navbar sits on top of the dark strip */}
// //       <TopNavbar onSearchOpen={() => setShowSearch(true)} />

// //       {/* Body — offset by navbar height */}
// //       <div className="flex h-[calc(100vh-3.5rem)] mt-14">

// //         {/* Left sidebar — light theme */}
// //         <aside className="hidden lg:flex w-72 h-full overflow-y-auto flex-col px-4 py-5 gap-5 shrink-0 bg-white border-r border-stone-200">

// //           {/* Search */}
// //           <button
// //             onClick={() => setShowSearch(true)}
// //             className="flex items-center gap-2.5 w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-400 hover:border-stone-300 hover:bg-stone-100 transition-all text-left"
// //           >
// //             <Search className="h-4 w-4 shrink-0" />
// //             <span>Search sites, experiences...</span>
// //           </button>

// //           {/* Packages */}
// //           <div>
// //             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
// //               Packages
// //             </p>
// //             <div className="space-y-2">
// //               <Link
// //                 href={ROUTES.packages}
// //                 className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 hover:border-amber-200 hover:bg-amber-50 transition-all group"
// //               >
// //                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 shrink-0">
// //                   <Package className="h-4 w-4 text-amber-600" />
// //                 </div>
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-sm font-medium text-stone-700 group-hover:text-amber-700">Browse Packages</p>
// //                   <p className="text-xs text-stone-400">Tourism packages</p>
// //                 </div>
// //               </Link>
// //               <Link
// //                 href={ROUTES.packages}
// //                 className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1"
// //               >
// //                 See more →
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Cultural Sites */}
// //           <div>
// //             <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
// //               Cultural Sites
// //             </p>
// //             <div className="space-y-2">
// //               <Link
// //                 href={ROUTES.sites}
// //                 className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
// //               >
// //                 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 shrink-0">
// //                   <Globe className="h-4 w-4 text-emerald-600" />
// //                 </div>
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-sm font-medium text-stone-700 group-hover:text-emerald-700">Explore Sites</p>
// //                   <p className="text-xs text-stone-400">Cultural heritage</p>
// //                 </div>
// //               </Link>
// //               <Link
// //                 href={ROUTES.sites}
// //                 className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors px-1"
// //               >
// //                 See more →
// //               </Link>
// //             </div>
// //           </div>

// //           {/* Sign in CTA — guests only */}
// //           {!isAuthenticated && (
// //             <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4">
// //               <p className="text-sm font-semibold text-stone-800 mb-1">Join CulturalHub</p>
// //               <p className="text-xs text-stone-500 mb-3">Like, comment and follow cultural sites.</p>
// //               <Link
// //                 href={ROUTES.login}
// //                 className="flex items-center justify-center gap-2 w-full rounded-xl bg-amber-400 py-2 text-sm font-bold text-stone-900 hover:bg-amber-300 transition-all"
// //               >
// //                 <LogIn className="h-4 w-4" />
// //                 Sign in
// //               </Link>
// //             </div>
// //           )}
// //         </aside>

// //         {/* Center feed */}
// //         <main className="flex-1 h-full overflow-y-auto bg-stone-100">
// //           <div className="max-w-2xl mx-auto px-4 py-6">
// //             {children}
// //           </div>
// //         </main>
// //       </div>

// //       {/* Search overlay */}
// //       {showSearch && (
// //         <div className="fixed inset-0 z-50">
// //           <SearchOverlay onClose={() => setShowSearch(false)} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

