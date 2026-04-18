
"use client";

/**
 * Shared admin UI primitives
 * ──────────────────────────
 * AdminPageHeader   — page title + description + optional action button
 * StatCard          — metric card with icon, value, trend
 * DataTable         — sortable, searchable table shell
 * AdminBadge        — role/status pill
 * ActionMenu        — three-dot dropdown for row actions
 * EmptyState        — zero-data placeholder
 * SectionCard       — card wrapper with title
 */

import { useState, useRef, useEffect } from "react";
import { Search, TrendingUp, TrendingDown, MoreVertical, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/src/utils/cn";

// ─────────────────────────────────────────────────────────────────
// AdminPageHeader
// ─────────────────────────────────────────────────────────────────
interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminPageHeader({ title, description, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && <div className="mt-2 sm:mt-0 shrink-0">{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;   // tailwind bg class e.g. "bg-amber-400"
  trend?: { value: string; up: boolean };
  subtitle?: string;
}

export function StatCard({ label, value, icon: Icon, iconColor, trend, subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900 p-5 hover:border-white/15 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl shrink-0", iconColor)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      {trend && (
        <div className={cn(
          "mt-3 flex items-center gap-1 text-xs font-semibold",
          trend.up ? "text-emerald-400" : "text-red-400"
        )}>
          {trend.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend.value}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AdminBadge
// ─────────────────────────────────────────────────────────────────
const BADGE_VARIANTS: Record<string, string> = {
  // roles
  admin:    "bg-violet-400/15 text-violet-300 border-violet-400/20",
  provider: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  tourist:  "bg-slate-400/15 text-slate-300 border-slate-400/20",
  // statuses
  active:   "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  inactive: "bg-red-400/15 text-red-300 border-red-400/20",
  pending:  "bg-amber-400/15 text-amber-300 border-amber-400/20",
  verified: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  unverified: "bg-slate-400/15 text-slate-400 border-slate-400/20",
  suspended: "bg-red-400/15 text-red-300 border-red-400/20",
  // booking / payment
  confirmed: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  cancelled: "bg-red-400/15 text-red-300 border-red-400/20",
  completed: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  paid:      "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  unpaid:    "bg-red-400/15 text-red-300 border-red-400/20",
  refunded:  "bg-amber-400/15 text-amber-300 border-amber-400/20",
  // reports
  open:      "bg-orange-400/15 text-orange-300 border-orange-400/20",
  resolved:  "bg-slate-400/15 text-slate-400 border-slate-400/20",
  // packages / experiences
  published: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  draft:     "bg-slate-400/15 text-slate-400 border-slate-400/20",
};

export function AdminBadge({ value }: { value: string }) {
  const key = value?.toLowerCase?.() ?? "";
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
      BADGE_VARIANTS[key] ?? "bg-slate-400/15 text-slate-400 border-slate-400/20"
    )}>
      {value}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────
// ActionMenu — three-dot dropdown
// ─────────────────────────────────────────────────────────────────
export interface ActionItem {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  destructive?: boolean;
}

export function ActionMenu({ items }: { items: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/8 hover:text-white transition-all"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-white/10 bg-slate-800 shadow-2xl shadow-black/40 py-1 overflow-hidden">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => { item.onClick(); setOpen(false); }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors text-left",
                item.destructive
                  ? "text-red-400 hover:bg-red-400/10"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              )}
            >
              {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// DataTable
// ─────────────────────────────────────────────────────────────────
interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  rightAction?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchKeys = [],
  searchPlaceholder = "Search...",
  emptyMessage = "No records found.",
  rightAction,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = data.filter(row => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(q));
  });

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const va = String((a as Record<string, unknown>)[sortKey] ?? "");
        const vb = String((b as Record<string, unknown>)[sortKey] ?? "");
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      })
    : filtered;

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900 overflow-hidden">
      {/* Table toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3.5 border-b border-white/8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-600 font-medium">
            {filtered.length} of {data.length} records
          </span>
          {rightAction}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-slate-500",
                    col.sortable && "cursor-pointer select-none hover:text-slate-300 transition-colors",
                    col.hideOnMobile && "hidden sm:table-cell",
                    col.className
                  )}
                  onClick={col.sortable ? () => toggleSort(String(col.key)) : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      sortDir === "asc"
                        ? <ChevronUp className="h-3 w-3 text-amber-400" />
                        : <ChevronDown className="h-3 w-3 text-amber-400" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/4">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-slate-600">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map(row => (
                <tr key={row.id} className="hover:bg-white/3 transition-colors group">
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        "px-4 py-3 text-sm text-slate-300",
                        col.hideOnMobile && "hidden sm:table-cell",
                        col.className
                      )}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[String(col.key)] ?? "—")
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SectionCard
// ─────────────────────────────────────────────────────────────────
export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-slate-900 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Avatar initials
// ─────────────────────────────────────────────────────────────────
export function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-amber-400", "bg-emerald-500", "bg-blue-500", "bg-violet-500", "bg-rose-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn(
      "flex shrink-0 items-center justify-center rounded-full font-bold text-white",
      color,
      size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
    )}>
      {initials}
    </div>
  );
}