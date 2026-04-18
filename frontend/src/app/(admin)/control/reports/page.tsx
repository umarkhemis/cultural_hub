
"use client";

/**
 * Admin Reports Page
 * Shows flagged content with resolve / dismiss actions.
 * Uses useAdminReports hook — backend /admin/reports endpoint.
 */

import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { AdminPageHeader, DataTable, AdminBadge, ActionMenu, StatCard } from "@/src/components/admin/admin-ui";
import { useAdminReports } from "@/src/features/admin/hooks";
import { useToastStore } from "@/src/store/toast-store";
import { formatDate } from "@/src/utils/formatDate";
import { Flag, Clock } from "lucide-react";
import type { AdminReport } from "@/src/lib/api/admin";

export default function AdminReportsPage() {
  const { data, isLoading, isError, refetch } = useAdminReports();
  const { addToast } = useToastStore();
  const [processing, setProcessing] = useState<string | null>(null);

  if (isLoading) return <LoadingState label="Loading reports..." />;
  if (isError)   return <ErrorState description="Could not load reports." />;

  const reports = data ?? [];
  const open     = reports.filter(r => r.status === "open").length;
  const resolved = reports.filter(r => r.status === "resolved").length;

  const handleAction = async (report: AdminReport, action: "resolve" | "dismiss") => {
    setProcessing(String(report.id));
    try {
      // TODO: await apiClient.patch(`/admin/reports/${report.id}`, { status: action === "resolve" ? "resolved" : "dismissed" });
      addToast({
        type: "success",
        title: action === "resolve" ? "Report resolved" : "Report dismissed",
      });
      refetch();
    } catch {
      addToast({ type: "error", title: "Could not update report." });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Flagged content requiring moderation review."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard
          label="Open Reports"
          value={open}
          icon={AlertTriangle}
          iconColor="bg-orange-500"
          subtitle={open > 0 ? "Needs attention" : "All clear"}
        />
        <StatCard
          label="Resolved"
          value={resolved}
          icon={CheckCircle}
          iconColor="bg-emerald-500"
        />
        <StatCard
          label="Total"
          value={reports.length}
          icon={Flag}
          iconColor="bg-slate-600"
        />
      </div>

      <DataTable
        data={reports}
        searchKeys={["reason", "status"] as (keyof AdminReport)[]}
        searchPlaceholder="Search by reason or status..."
        emptyMessage="No reports found."
        columns={[
          {
            key: "id",
            label: "Report",
            render: (r) => (
              <div className="flex items-center gap-2.5">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  r.status === "open" ? "bg-orange-400/15 border border-orange-400/20" : "bg-slate-400/10 border border-white/5"
                }`}>
                  <Flag className={`h-3.5 w-3.5 ${r.status === "open" ? "text-orange-400" : "text-slate-600"}`} />
                </div>
                <span className="text-xs font-mono text-slate-500">#{String(r.id).slice(0, 8)}</span>
              </div>
            ),
          },
          {
            key: "reason",
            label: "Reason",
            sortable: true,
            render: (r) => (
              <p className="text-sm text-slate-300 max-w-[200px] truncate">{r.reason || "—"}</p>
            ),
          },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (r) => <AdminBadge value={r.status} />,
          },
          {
            key: "created_at",
            label: "Reported",
            sortable: true,
            hideOnMobile: true,
            render: (r) => (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatDate(r.created_at)}
              </div>
            ),
          },
          {
            key: "actions",
            label: "",
            render: (r) => (
              <ActionMenu items={[
                ...(r.status === "open" ? [
                  {
                    label: "Resolve",
                    icon: CheckCircle,
                    onClick: () => handleAction(r, "resolve"),
                  },
                  {
                    label: "Dismiss",
                    icon: XCircle,
                    onClick: () => handleAction(r, "dismiss"),
                    destructive: true as const,
                  },
                ] : []),
                {
                  label: "View content",
                  icon: ExternalLink,
                  onClick: () => addToast({ type: "info", title: "Deep link coming soon" }),
                },
              ]} />
            ),
          },
        ]}
      />
    </div>
  );
}