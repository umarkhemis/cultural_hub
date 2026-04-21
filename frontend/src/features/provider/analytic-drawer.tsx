
// src/features/provider/analytics-drawer.tsx
"use client";

import { useEffect } from "react";
import { X, Eye, Users, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { useProviderExperienceAnalytics } from "./use-experience-analytics";

interface AnalyticsDrawerProps {
  experienceId: string;
  onClose: () => void;
}

export function AnalyticsDrawer({ experienceId, onClose }: AnalyticsDrawerProps) {
  const { data, isLoading } = useProviderExperienceAnalytics(experienceId);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Experience Analytics</h2>
            <p className="text-xs text-slate-500 mt-0.5">How this experience is performing</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-slate-600 animate-spin" />
            </div>
          ) : data ? (
            <>
              {/* ── Key metrics ── */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    icon: Eye,
                    iconColor: "text-emerald-500",
                    bgColor: "bg-emerald-50",
                    label: "Total Views",
                    value: data.total_views.toLocaleString(),
                  },
                  {
                    icon: Users,
                    iconColor: "text-blue-500",
                    bgColor: "bg-blue-50",
                    label: "Unique Viewers",
                    value: data.unique_logged_in_viewers.toLocaleString(),
                  },
                  {
                    icon: TrendingUp,
                    iconColor: "text-amber-500",
                    bgColor: "bg-amber-50",
                    label: "Anonymous Views",
                    value: data.anonymous_views.toLocaleString(),
                  },
                  {
                    icon: CheckCircle,
                    iconColor: "text-violet-500",
                    bgColor: "bg-violet-50",
                    label: "Completions",
                    value: data.completion_count.toLocaleString(),
                  },
                ].map(({ icon: Icon, iconColor, bgColor, label, value }) => (
                  <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl mb-2 ${bgColor}`}>
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    <p className="text-xl font-bold text-slate-900">{value}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* ── Avg watch time ── */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 shrink-0">
                  <Clock className="h-5 w-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {Math.round(data.average_watch_seconds)}s avg watch time
                  </p>
                  <p className="text-xs text-slate-500">Average time spent viewing this experience</p>
                </div>
              </div>

              {/* ── Completion rate ── */}
              {data.total_views > 0 && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-700">Completion Rate</p>
                    <p className="text-xs font-bold text-slate-900">
                      {Math.round((data.completion_count / data.total_views) * 100)}%
                    </p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{ width: `${Math.round((data.completion_count / data.total_views) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ── Recent viewers ── */}
              {data.recent_viewers?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-3">Recent Views</p>
                  <div className="space-y-2">
                    {data.recent_viewers.slice(0, 10).map((v: {
                      viewer_user_id: string | null;
                      session_id: string | null;
                      viewed_at: string;
                      watch_seconds: number;
                      completed: boolean;
                    }, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 shrink-0">
                            {v.viewer_user_id ? "U" : "?"}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-700">
                              {v.viewer_user_id ? "Logged-in user" : "Anonymous visitor"}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(v.viewed_at).toLocaleDateString()} · {v.watch_seconds}s
                            </p>
                          </div>
                        </div>
                        {v.completed && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                            Completed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <Eye className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-500">No analytics yet</p>
              <p className="text-xs text-slate-400 mt-1">Views will appear here once people watch this experience.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}