
"use client";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { PackageCard } from "@/src/features/packages/package-card";
import { usePackages } from "@/src/features/packages/hooks";
import { ProviderPackageCard } from "@/src/features/provider/provider-package-card";

export default function PackagesPage() {
  const { data, isLoading, isError } = usePackages();

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Tourism Packages
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Browse bookable cultural experiences created by different providers.
          </p>
        </div>

        {isLoading ? <LoadingState label="Loading packages..." /> : null}

        {isError ? (
          <ErrorState description="We could not load packages right now." />
        ) : null}

        {!isLoading && !isError && data?.items?.length === 0 ? (
          <EmptyState
            title="No packages available"
            description="Published packages will appear here once providers add them."
          />
        ) : null}

        {!isLoading && !isError && data?.items?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <PackageCard key={item.id} item={item} />
            ))}


          </div>
        ) : null}
      
      </PageContainer>
    </main>
  );
}