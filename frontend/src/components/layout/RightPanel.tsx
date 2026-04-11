"use client";

import Link from "next/link";
import { Search, MapPin, Package2, Landmark, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { useSites } from "@/src/features/sites/hooks";
import { usePackages } from "@/src/features/packages/hooks";

import type { TourismPackage } from "@/src/types/package";
import type { Site } from "@/src/types/sites";
import { cn } from "@/src/utils/cn";

export function RightPanel() {
  const [query, setQuery] = useState("");

  const {
    data: sites = [],
    isLoading: sitesLoading,
    isError: sitesError,
  } = useSites();

  // packagesRaw may be either:
  // 1) TourismPackage[]
  // 2) { items: TourismPackage[]; ...paginationMeta }
  const {
    data: packagesRaw,
    isLoading: packagesLoading,
    isError: packagesError,
  } = usePackages();

  // ✅ Normalize shape locally so RightPanel never breaks.
  const packages: TourismPackage[] = useMemo(() => {
    if (Array.isArray(packagesRaw)) return packagesRaw;
    if (packagesRaw && Array.isArray((packagesRaw as { items?: TourismPackage[] }).items)) {
      return (packagesRaw as { items: TourismPackage[] }).items;
    }
    return [];
  }, [packagesRaw]);

  const MAX_ITEMS = 4;

  const filteredPackages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return packages.slice(0, MAX_ITEMS);
    return packages
      .filter((p) =>
        [p.package_name, p.description, p.provider?.site_name, p.provider?.location]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, MAX_ITEMS);
  }, [packages, query]);

  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sites.slice(0, MAX_ITEMS);
    return sites
      .filter((s) =>
        [s.site_name, s.location, s.description]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, MAX_ITEMS);
  }, [sites, query]);

  return (
    <aside className="sticky top-6">
      <div className="flex flex-col gap-5">
        {/* SEARCH */}
        <section className="rounded-2xl border border-[#e5ddd1] bg-[#f7f3ed] p-4 shadow-sm">
          <div className="flex items-center gap-2 rounded-xl border border-[#ddd3c4] bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages, sites..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              aria-label="Search packages and sites"
            />
          </div>
        </section>

        {/* PACKAGES */}
        <section className="rounded-2xl border border-[#e5ddd1] bg-[#f7f3ed] p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Package2 className="h-4 w-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-slate-900">Popular Packages</h3>
          </div>

          {packagesLoading ? (
            <PanelSkeleton label="Loading packages..." />
          ) : packagesError ? (
            <PanelError label="Could not load packages." />
          ) : filteredPackages.length === 0 ? (
            <PanelEmpty label={query ? "No packages match your search." : "No packages available yet."} />
          ) : (
            <div className="flex flex-col gap-2">
              {filteredPackages.map((item) => (
                <PackageMiniRow key={item.id} item={item} />
              ))}
            </div>
          )}

          <Link href="/packages" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline">
            View more packages <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* SITES */}
        <section className="rounded-2xl border border-[#e5ddd1] bg-[#f7f3ed] p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-semibold text-slate-900">Cultural Sites</h3>
          </div>

          {sitesLoading ? (
            <PanelSkeleton label="Loading sites..." />
          ) : sitesError ? (
            <PanelError label="Could not load sites." />
          ) : filteredSites.length === 0 ? (
            <PanelEmpty label={query ? "No sites match your search." : "No sites available yet."} />
          ) : (
            <div className="flex flex-col gap-2">
              {filteredSites.map((item) => (
                <SiteMiniRow key={item.id} item={item} />
              ))}
            </div>
          )}

          <Link href="/sites" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline">
            Explore more sites <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>
    </aside>
  );
}

function PackageMiniRow({ item }: { item: TourismPackage }) {
  return (
    <Link
      href={`/packages/${item.id}`}
      className={cn(
        "flex items-start justify-between gap-3 rounded-xl border border-[#e6ded2] bg-white px-3 py-2",
        "hover:bg-[#fcfaf6] transition"
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{item.package_name}</p>
        <p className="truncate text-xs text-slate-500">{item.provider?.site_name}</p>
      </div>
      {item.provider?.location ? (
        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin className="h-3 w-3" />
          {item.provider.location}
        </span>
      ) : null}
    </Link>
  );
}

function SiteMiniRow({ item }: { item: Site }) {
  return (
    <Link
      href={`/sites/${item.id}`}
      className={cn(
        "flex items-start justify-between gap-3 rounded-xl border border-[#e6ded2] bg-white px-3 py-2",
        "hover:bg-[#fcfaf6] transition"
      )}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">{item.site_name}</p>
        <p className="truncate text-xs text-slate-500">{item.description ?? "Cultural destination"}</p>
      </div>
      {item.location ? (
        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-slate-500">
          <MapPin className="h-3 w-3" />
          {item.location}
        </span>
      ) : null}
    </Link>
  );
}

function PanelSkeleton({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-white p-3 text-xs text-slate-500">{label}</div>;
}
function PanelError({ label }: { label: string }) {
  return <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">{label}</div>;
}
function PanelEmpty({ label }: { label: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-500">{label}</div>;
}