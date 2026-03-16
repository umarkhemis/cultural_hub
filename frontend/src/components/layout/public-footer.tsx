
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import { useAuth } from "@/src/hooks/useAuth";

export function PublicFooter() {
  const { isAuthenticated, user } = useAuth();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CulturalHub</p>

          <div className="flex flex-wrap gap-4">
            <Link href={ROUTES.feed} className="hover:text-slate-900">Explore</Link>
            <Link href={ROUTES.packages} className="hover:text-slate-900">Packages</Link>
            <Link href={ROUTES.sites} className="hover:text-slate-900">Cultural Sites</Link>
            <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            {!isAuthenticated ? (
              <Link href={ROUTES.login} className="hover:text-slate-900">Login</Link>
            ) : user?.role === "provider" ? (
              <Link href={ROUTES.providerRoot} className="hover:text-slate-900">Dashboard</Link>
            ) : (
              <Link href={ROUTES.touristBookings} className="hover:text-slate-900">My Bookings</Link>
            )}
          </div>
        </div>

        <p className="max-w-3xl text-xs leading-6 text-slate-500">
          This platform helps cultural service providers showcase experiences and packages
          while allowing visitors to discover, engage, and book meaningful tourism activities.
        </p>
      </div>
    </footer>
  );
}




































// import Link from "next/link";
// import { ROUTES } from "@/src/constants/routes";

// export function PublicFooter() {
//   return (
//     <footer className="border-t border-slate-200 bg-white">
//       <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
//         <p>© {new Date().getFullYear()} Cultural Hub</p>

//         <div className="flex flex-wrap gap-4">
//           <Link href={ROUTES.feed} className="hover:text-slate-900">
//             Explore
//           </Link>
//           <Link href={ROUTES.packages} className="hover:text-slate-900">
//             Packages
//           </Link>
//           <Link href={ROUTES.login} className="hover:text-slate-900">
//             Login
//           </Link>
//         </div>
//       </div>
//     </footer>
//   );
// }