// cultural_hub\frontend\src\components\feed\SearchOverlay.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import {
  Loader2,
  Search,
  X,
  Globe,
  Package,
  MapPin,
  MessageCircle,
} from "lucide-react";

import { searchAll } from "@/src/lib/api/search";
import type {
  SearchSiteResult,
  SearchExperienceResult,
} from "@/src/lib/api/search";

import { ROUTES } from "@/src/constants/routes";

// ── Search overlay ────────────────────────────
export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.length >= 1,
    staleTime: 30_000,
  });

  const sites: SearchSiteResult[] = data?.data.sites ?? [];
  const experiences: SearchExperienceResult[] =
    data?.data.experiences ?? [];

  const hasResults = sites.length > 0 || experiences.length > 0;
  const isSearching = debouncedQuery.length >= 1;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md">
      {/* Search bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        {isFetching ? (
          <Loader2 className="h-5 w-5 text-amber-400 animate-spin shrink-0" />
        ) : (
          <Search className="h-5 w-5 text-white/40 shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sites, experiences, locations..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-all"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="ml-1 text-xs font-semibold text-white/50 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!isSearching && (
          <div className="px-4 py-6 space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
                Explore
              </p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Cultural Sites", href: ROUTES.sites, icon: Globe },
                  { label: "Packages", href: ROUTES.packages, icon: Package },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
                  >
                    <item.icon className="h-4 w-4 text-amber-400" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {isSearching && isFetching && !data && (
          <div className="px-4 py-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-white/10 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-2/3 rounded-full bg-white/10" />
                  <div className="h-2.5 w-1/3 rounded-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isSearching && !isFetching && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Search className="h-10 w-10 text-white/10" />
            <p className="text-sm text-white/40">
              No results for{" "}
              <span className="text-white/60 font-medium">
                "{debouncedQuery}"
              </span>
            </p>
            <p className="text-xs text-white/20">
              Try different keywords
            </p>
          </div>
        )}

        {isSearching && hasResults && (
          <div className="px-4 py-4 space-y-6">
            {/* Sites */}
            {sites.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
                  Cultural Sites
                </p>

                <div className="space-y-1">
                  {sites.map((site) => (
                    <Link
                      key={site.id}
                      href={`/sites/${site.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/8 transition-all"
                    >
                      {site.logo_url ? (
                        <img
                          src={site.logo_url}
                          alt={site.site_name}
                          className="h-10 w-10 rounded-xl object-cover border border-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-xs font-bold text-amber-400">
                          {site.site_name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {site.site_name}
                        </p>

                        {site.location && (
                          <p className="flex items-center gap-1 text-xs text-white/40 truncate">
                            <MapPin className="h-2.5 w-2.5" />
                            {site.location}
                          </p>
                        )}
                      </div>

                      <Globe className="h-4 w-4 text-white/20 ml-auto" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Experiences */}
            {experiences.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
                  Experiences
                </p>

                <div className="space-y-1">
                  {experiences.map((exp) => (
                    <Link
                      key={exp.id}
                      href={`/experiences/${exp.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-white/8 transition-all"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <MessageCircle className="h-4 w-4 text-white/40" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm text-white line-clamp-1">
                          {exp.caption}
                        </p>

                        {exp.location && (
                          <p className="flex items-center gap-1 text-xs text-white/40 truncate">
                            <MapPin className="h-2.5 w-2.5" />
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}