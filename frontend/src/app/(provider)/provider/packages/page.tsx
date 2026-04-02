
"use client";

import Link from "next/link";
import { Plus, Package, BoxSelect } from "lucide-react";

import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ROUTES } from "@/src/constants/routes";
import { useProviderPackages } from "@/src/features/provider/hooks";
import { ProviderPackageCard } from "@/src/features/provider/provider-package-card";

export default function ProviderPackagesPage() {
  const { data, isLoading, isError } = useProviderPackages();

  const totalPackages = data?.length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 mb-4">
            <Package className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">Tourism Packages</span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your Packages
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed max-w-lg">
                Manage the tourism packages you offer to tourists.
              </p>
            </div>

            <Link href={ROUTES.providerNewPackage}>
              <button className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-400 transition-all shrink-0">
                <Plus className="h-4 w-4" />
                Create Package
              </button>
            </Link>
          </div>

          {/* Count pill — only show when data is loaded */}
          {!isLoading && !isError && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 shadow-sm">
              <BoxSelect className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">
                {totalPackages} {totalPackages === 1 ? "package" : "packages"} total
              </span>
            </div>
          )}
        </div>

        {/* ── States ── */}
        {isLoading && <LoadingState label="Loading packages..." />}
        {isError && (
          <ErrorState description="We could not load your packages right now." />
        )}

        {!isLoading && !isError && totalPackages === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
              <Package className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No packages yet</h3>
            <p className="mt-1.5 text-sm text-slate-400 max-w-xs mx-auto">
              Create your first package to start receiving bookings from tourists.
            </p>
            <Link href={ROUTES.providerNewPackage}>
              <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-400 transition-all">
                <Plus className="h-4 w-4" />
                Create your first package
              </button>
            </Link>
          </div>
        )}

        {/* ── Grid ── */}
        {!isLoading && !isError && totalPackages > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {data!.map((item) => (
              <ProviderPackageCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}


































// "use client";

// import Link from "next/link";

// import { Button } from "@/src/components/ui/button";
// import { EmptyState } from "@/src/components/shared/empty-state";
// import { ErrorState } from "@/src/components/shared/error-state";
// import { LoadingState } from "@/src/components/shared/loading-state";
// import { ROUTES } from "@/src/constants/routes";
// import { PackageCard } from "@/src/features/packages/package-card";
// import { useProviderPackages } from "@/src/features/provider/hooks";
// import { ProviderPackageCard } from "@/src/features/provider/provider-package-card";

// export default function ProviderPackagesPage() {
//   const { data, isLoading, isError } = useProviderPackages();

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
//             Packages
//           </h1>
//           <p className="mt-2 text-sm leading-6 text-slate-600">
//             Manage the tourism packages you offer to tourists.
//           </p>
//         </div>

//         <Link href={ROUTES.providerNewPackage}>
//           <Button>Create Package</Button>
//         </Link>
//       </div>

//       {isLoading ? <LoadingState label="Loading provider packages..." /> : null}
//       {isError ? (
//         <ErrorState description="We could not load your packages right now." />
//       ) : null}

//       {!isLoading && !isError && data?.length === 0 ? (
//         <EmptyState
//           title="No packages yet"
//           description="Create your first package to start receiving bookings."
//         />
//       ) : null}

//       {!isLoading && !isError && data?.length ? (
//         <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
//           {data.map((item) => (
//             <ProviderPackageCard key={item.id} item={item} />
//           ))}
//         </div>
//       ) : null}
//     </div>
//   );
// }