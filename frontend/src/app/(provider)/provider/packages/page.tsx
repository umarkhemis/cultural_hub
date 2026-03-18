
"use client";

import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ROUTES } from "@/src/constants/routes";
import { PackageCard } from "@/src/features/packages/package-card";
import { useProviderPackages } from "@/src/features/provider/hooks";
import { ProviderPackageCard } from "@/src/features/provider/provider-package-card";

export default function ProviderPackagesPage() {
  const { data, isLoading, isError } = useProviderPackages();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Packages
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage the tourism packages you offer to tourists.
          </p>
        </div>

        <Link href={ROUTES.providerNewPackage}>
          <Button>Create Package</Button>
        </Link>
      </div>

      {isLoading ? <LoadingState label="Loading provider packages..." /> : null}
      {isError ? (
        <ErrorState description="We could not load your packages right now." />
      ) : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyState
          title="No packages yet"
          description="Create your first package to start receiving bookings."
        />
      ) : null}

      {!isLoading && !isError && data?.length ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <ProviderPackageCard key={item.id} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}