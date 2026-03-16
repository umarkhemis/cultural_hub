
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Cultural Hub</p>

        <div className="flex flex-wrap gap-4">
          <Link href={ROUTES.feed} className="hover:text-slate-900">
            Explore
          </Link>
          <Link href={ROUTES.providerPackages} className="hover:text-slate-900">
            Packages
          </Link>
          <Link href={ROUTES.login} className="hover:text-slate-900">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}