
"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/src/constants/routes";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useToastStore } from "@/src/store/toast-store";

export function PublicNavbar() {
  const router = useRouter();
  const { isAuthenticated, user, clearSession } = useAuth();
  const { addToast } = useToastStore();

  const handleLogout = () => {
    clearSession();
    addToast({
      type: "success",
      title: "Logged out",
      description: "Your session has been cleared successfully.",
    });
    router.push(ROUTES.welcome);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.welcome} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            CT
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">
              Cultural Hub
            </p>
            <p className="text-xs text-slate-500">Experience Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href={ROUTES.feed} className="text-sm text-slate-700 hover:text-slate-900">
            Explore
          </Link>
          <Link href={ROUTES.packages} className="text-sm text-slate-700 hover:text-slate-900">
            Packages
          </Link>
          {isAuthenticated && user?.role === "tourist" ? (
            <Link
              href={ROUTES.touristBookings}
              className="text-sm text-slate-700 hover:text-slate-900"
            >
              My Bookings
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <Link
                href={user.role === "provider" ? ROUTES.providerRoot : ROUTES.touristProfile}
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
              <Link href={ROUTES.login}>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href={ROUTES.register}>
                <Button>Get Started</Button>
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}











































// "use client";

// import Link from "next/link";
// import { Menu, User } from "lucide-react";
// import { ROUTES } from "@/src/constants/routes";
// import { Button } from "@/src/components/ui/button";
// import { useAuth } from "@/src/hooks/useAuth";

// export function PublicNavbar() {
//   const { isAuthenticated, user, clearSession } = useAuth();

//   return (
//     <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
//       <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
//         <Link href={ROUTES.welcome} className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
//             CT
//           </div>
//           <div className="hidden sm:block">
//             <p className="text-sm font-semibold text-slate-900">
//               Cultural Hub
//             </p>
//             <p className="text-xs text-slate-500">Experience Platform</p>
//           </div>
//         </Link>

//         <nav className="hidden items-center gap-6 md:flex">
//           <Link href={ROUTES.feed} className="text-sm text-slate-700 hover:text-slate-900">
//             Explore
//           </Link>
//           <Link href={ROUTES.providerPackages} className="text-sm text-slate-700 hover:text-slate-900">
//             Packages
//           </Link>
//         </nav>

//         <div className="flex items-center gap-2">
//           {isAuthenticated && user ? (
//             <>
//               <Link
//                 href={user.role === "provider" ? ROUTES.providerRoot : ROUTES.feed}
//                 className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 sm:inline-flex"
//               >
//                 <User className="h-4 w-4" />
//                 {user.full_name.split(" ")[0]}
//               </Link>
//               <Button variant="ghost" onClick={clearSession}>
//                 Logout
//               </Button>
//             </>
//           ) : (
//             <>
//               <Link href={ROUTES.login}>
//                 <Button variant="ghost">Login</Button>
//               </Link>
//               <Link href={ROUTES.register}>
//                 <Button>Get Started</Button>
//               </Link>
//             </>
//           )}

//           <button
//             type="button"
//             className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden"
//             aria-label="Open menu"
//           >
//             <Menu className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }