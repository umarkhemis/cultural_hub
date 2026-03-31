
"use client";

import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminListCard } from "@/src/components/admin/admin-list-card";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useAdminReports } from "@/src/features/admin/hooks";
import { formatDate } from "@/src/utils/formatDate";

export default function AdminReportsPage() {
  const { data, isLoading, isError } = useAdminReports();

  if (isLoading) return <LoadingState label="Loading reports..." />;
  if (isError) return <ErrorState description="Could not load reports." />;

  return (
    <div>
      <AdminPageHeader
        title="Reports"
        description="Track moderation reports and content concerns across the platform."
      />

      <div className="grid gap-4">
        {data?.map((report) => (
          <AdminListCard
            key={report.id}
            title={`Report ${report.id.slice(0, 8)}`}
            subtitle={report.reason}
            meta={report.status}
          >
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Reporter: {report.reporter_id}</span>
              <span>Created: {formatDate(report.created_at)}</span>
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}