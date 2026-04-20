
"use client";

// ─────────────────────────────────────────────────
// Admin Experiences Page
// ─────────────────────────────────────────────────

import { ExternalLink, Trash2 } from "lucide-react";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { AdminPageHeader, DataTable, AdminBadge, ActionMenu } from "@/src/components/admin/admin-ui";
import { useAdminExperiences } from "@/src/features/admin/hooks";
import { useToastStore } from "@/src/store/toast-store";
import { formatDate } from "@/src/utils/formatDate";

export function AdminExperiencesPage() {
  const { data, isLoading, isError } = useAdminExperiences();
  const { addToast } = useToastStore();

  if (isLoading) return <LoadingState label="Loading experiences..." />;
  if (isError)   return <ErrorState description="Could not load experiences." />;

  const experiences = data ?? [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experiences"
        description={`${experiences.length.toLocaleString()} cultural experience posts on the platform.`}
      />
      <DataTable
        data={experiences}
        searchKeys={["caption", "status"] as never[]}
        searchPlaceholder="Search by caption or status..."
        emptyMessage="No experiences found."
        columns={[
          {
            key: "provider",
            label: "Provider",
            render: (e) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-400/15 text-xs font-bold text-blue-400 border border-blue-400/20">
                  {e.provider?.site_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <p className="text-sm font-semibold text-white truncate max-w-[140px]">{e.provider?.site_name ?? "—"}</p>
              </div>
            ),
          },
          {
            key: "caption",
            label: "Caption",
            render: (e) => (
              <p className="text-xs text-slate-400 max-w-[200px] truncate">{e.caption || "—"}</p>
            ),
          },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (e) => <AdminBadge value={e.status ?? "published"} />,
          },
          {
            key: "likes_count",
            label: "Likes",
            sortable: true,
            hideOnMobile: true,
            render: (e) => (
              <span className="text-sm font-medium text-slate-300">{(e.likes_count ?? 0).toLocaleString()}</span>
            ),
          },
          {
            key: "comments_count",
            label: "Comments",
            sortable: true,
            hideOnMobile: true,
            render: (e) => (
              <span className="text-sm font-medium text-slate-300">{(e.comments_count ?? 0).toLocaleString()}</span>
            ),
          },
          {
            key: "created_at",
            label: "Posted",
            sortable: true,
            hideOnMobile: true,
            render: (e) => <span className="text-xs text-slate-500">{formatDate(e.created_at)}</span>,
          },
          {
            key: "actions",
            label: "",
            render: (e) => (
              <ActionMenu items={[
                {
                  label: "View experience",
                  icon: ExternalLink,
                  onClick: () => window.open(`/experiences/${e.id}`, "_blank"),
                },
                {
                  label: "Remove post",
                  icon: Trash2,
                  onClick: () => addToast({ type: "success", title: "Post removed (connect API)" }),
                  destructive: true,
                },
              ]} />
            ),
          },
        ]}
      />
    </div>
  );
}

export default AdminExperiencesPage;