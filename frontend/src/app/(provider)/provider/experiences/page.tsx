
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus, VideoIcon, LayoutGrid, List, Search,
  ChevronLeft, ChevronRight, Trash2,
  Heart, MessageCircle,
} from "lucide-react";

import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { ROUTES } from "@/src/constants/routes";
import { useProviderExperiences, useDeleteExperienceMutation } from "@/src/features/provider/hooks";
import { ProviderExperienceCard } from "@/src/features/provider/provider-experience-card";
import ProviderExperienceRow from "@/src/features/provider/provider-experience-row";
import { useToastStore } from "@/src/store/toast-store";
import { Experience } from "@/src/types/experience";

const PAGE_SIZE = 12;

type SortKey = "newest" | "oldest" | "most_liked" | "most_commented";
type StatusFilter = "all" | "published" | "draft" | "archived";
type ViewMode = "grid" | "list";

export default function ProviderExperiencesPage() {
  const { data, isLoading, isError } = useProviderExperiences();
  const deleteMutation = useDeleteExperienceMutation();
  const { addToast } = useToastStore();

  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkConfirm, setBulkConfirm] = useState(false);

  const experiences = useMemo<Experience[]>(() => data ?? [], [data]);

  // ── Derived stats ──
  const totalLikes = experiences.reduce((s, e) => s + e.likes_count, 0);
  const totalComments = experiences.reduce((s, e) => s + e.comments_count, 0);

  // ── Filter + sort ──
  const filtered = useMemo(() => {
    let result = [...experiences];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.caption.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q)
      );
    }

    if (status !== "all") {
      result = result.filter((e) => e.status === status);
    }

    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === "most_liked") return b.likes_count - a.likes_count;
      if (sort === "most_commented") return b.comments_count - a.comments_count;
      return 0;
    });

    return result;
  }, [experiences, search, status, sort]);

  // ── Pagination ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  // ── Selection ──
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setBulkConfirm(false);
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((e) => e.id)));
    }
    setBulkConfirm(false);
  };

  const handleBulkDelete = async () => {
    if (!bulkConfirm) {
      setBulkConfirm(true);
      return;
    }
    try {
      await Promise.all([...selected].map((id) => deleteMutation.mutateAsync(id)));
      addToast({ type: "success", title: `${selected.size} experiences deleted.` });
      setSelected(new Set());
      setBulkConfirm(false);
    } catch {
      addToast({ type: "error", title: "Some deletions failed. Please try again." });
    }
  };

  const selectClass = "rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">

        {/* ── Page header ── */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 mb-3">
              <VideoIcon className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-700">Discovery Feed</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your Experiences
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage everything you&apos;ve published to the public feed.
            </p>
          </div>
          <Link href={ROUTES.providerNewExperience}>
            <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 transition-all shrink-0">
              <Plus className="h-4 w-4" />
              Create Experience
            </button>
          </Link>
        </div>

        {/* ── States ── */}
        {isLoading && <LoadingState label="Loading experiences..." />}
        {isError && <ErrorState description="We could not load your experiences right now." />}

        {!isLoading && !isError && (
          <>
            {/* ── Stats bar ── */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              {[
                { icon: <LayoutGrid className="h-4 w-4 text-slate-400" />, value: experiences.length, label: "Total" },
                { icon: <Heart className="h-4 w-4 text-rose-400" />, value: totalLikes, label: "Likes" },
                { icon: <MessageCircle className="h-4 w-4 text-blue-400" />, value: totalComments, label: "Comments" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  {icon}
                  <div>
                    <p className="text-base font-bold text-slate-900">{value.toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Toolbar ── */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  placeholder="Search by caption or location..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all shadow-sm"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Status filter */}
                <select
                  value={status}
                  onChange={(e) => { setStatus(e.target.value as StatusFilter); resetPage(); }}
                  className={selectClass}
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as SortKey); resetPage(); }}
                  className={selectClass}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="most_liked">Most liked</option>
                  <option value="most_commented">Most commented</option>
                </select>

                {/* View toggle */}
                <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => setView("list")}
                    className={`p-2.5 transition-colors ${view === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("grid")}
                    className={`p-2.5 transition-colors ${view === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Bulk action bar ── */}
            {selected.size > 0 && (
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-700">
                  {selected.size} experience{selected.size > 1 ? "s" : ""} selected
                </p>
                <button
                  onClick={handleBulkDelete}
                  disabled={deleteMutation.isPending}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:opacity-50 ${
                    bulkConfirm
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-white border border-red-200 text-red-600 hover:bg-red-100"
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {deleteMutation.isPending ? "Deleting..." : bulkConfirm ? "Confirm delete" : "Delete selected"}
                </button>
              </div>
            )}

            {/* ── Empty filtered state ── */}
            {filtered.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-8 py-16 text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">No experiences found</p>
                <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filters.</p>
              </div>
            )}

            {/* ── List view ── */}
            {filtered.length > 0 && view === "list" && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 accent-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex-1">Experience</span>
                  <span className="hidden sm:block text-xs font-semibold text-slate-500 uppercase tracking-wide w-24 text-center">Stats</span>
                  <span className="hidden sm:block text-xs font-semibold text-slate-500 uppercase tracking-wide w-20 text-center">Status</span>
                  <span className="w-20" />
                </div>
                {paginated.map((item, i) => (
                  <ProviderExperienceRow
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onToggleSelect={() => toggleSelect(item.id)}
                    isLast={i === paginated.length - 1}
                  />
                ))}
              </div>
            )}

            {/* ── Grid view ── */}
            {filtered.length > 0 && view === "grid" && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((item) => (
                  <ProviderExperienceCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "..." ? (
                          <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setPage(p as number)}
                            className={`h-8 w-8 rounded-xl text-xs font-semibold transition-all ${
                              page === p
                                ? "bg-slate-900 text-white shadow-sm"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition-all"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

