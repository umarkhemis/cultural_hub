
"use client";

import Link from "next/link";
import { MapPin, Package, Sparkles, Shield, ArrowRight, Globe } from "lucide-react";

import { PageContainer } from "@/src/components/layout/page-container";
import { EmptyState } from "@/src/components/shared/empty-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useSites } from "@/src/features/sites/hooks";

export default function SitesPage() {
  const { data, isLoading, isError } = useSites();

  return (
    <main className="bg-slate-50 pb-16">

      {/* Hero header */}
      <div className="bg-slate-900 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400">
              <Globe className="h-5 w-5 text-slate-900" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Explore
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cultural Sites
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover cultural destinations and providers sharing authentic experiences
            and tourism packages from around the world.
          </p>

          {/* Stats row */}
          {!isLoading && data?.length ? (
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white">{data.length}</span>
                cultural sites
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-amber-400">
                  {data.reduce((sum, s) => sum + (s.packages_count ?? 0), 0)}
                </span>
                packages
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white">
                  {data.reduce((sum, s) => sum + (s.experiences_count ?? 0), 0)}
                </span>
                experiences
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <PageContainer className="mt-8">
        {isLoading && <LoadingState label="Loading cultural sites..." />}
        {isError && <ErrorState description="We could not load cultural sites right now." />}

        {!isLoading && !isError && data?.length === 0 && (
          <EmptyState
            title="No cultural sites available"
            description="Published cultural sites will appear here once providers join the platform."
          />
        )}

        {!isLoading && !isError && data?.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((site) => (
              <Link
                key={site.id}
                href={`/sites/${site.id}`}
                className="group relative block overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
              >
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />

                <div className="p-5">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Avatar */}
                    {site.logo_url ? (
                      <img
                        src={site.logo_url}
                        alt={site.site_name}
                        className="h-14 w-14 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-base font-black text-white">
                        {site.site_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Verified badge */}
                    {site.verification_status === "verified" && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        <Shield className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Site name */}
                  <h2 className="text-base font-bold text-slate-900 leading-snug group-hover:text-amber-600 transition-colors">
                    {site.site_name}
                  </h2>

                  {/* Description */}
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {site.description || "No description yet."}
                  </p>

                  {/* Meta row */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    {site.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-500" />
                        {site.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3 text-slate-400" />
                      {site.packages_count ?? 0} packages
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-slate-400" />
                      {site.experiences_count ?? 0} experiences
                    </span>
                  </div>

                  {/* CTA footer */}
                  <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
                      Explore site
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}

