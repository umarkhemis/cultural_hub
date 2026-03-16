
"use client";

import Link from "next/link";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useSites } from "@/src/features/sites/hooks";

export default function SitesPage() {
  const { data, isLoading, isError } = useSites();

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Cultural Sites
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            Discover cultural destinations and providers sharing experiences and tourism packages.
          </p>
        </div>

        {isLoading ? <LoadingState label="Loading cultural sites..." /> : null}
        {isError ? <ErrorState description="We could not load cultural sites right now." /> : null}

        {!isLoading && !isError && data?.length === 0 ? (
          <EmptyState
            title="No cultural sites available"
            description="Published cultural sites will appear here once providers join the platform."
          />
        ) : null}

        {!isLoading && !isError && data?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((site) => (
              <Link
                key={site.id}
                href={`/sites/${site.id}`}
                className="block rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold text-slate-700">
                  {site.site_name.slice(0, 2).toUpperCase()}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{site.site_name}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {site.description || "No description yet."}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>{site.location || "Location not set"}</span>
                  <span>{site.packages_count ?? 0} packages</span>
                  <span>{site.experiences_count ?? 0} experiences</span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}


