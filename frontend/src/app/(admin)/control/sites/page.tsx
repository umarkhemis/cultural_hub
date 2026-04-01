
"use client";

import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminListCard } from "@/src/components/admin/admin-list-card";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useAdminSites } from "@/src/features/admin/hooks";
import { formatDate } from "@/src/utils/formatDate";

export default function AdminSitesPage() {
  const { data, isLoading, isError } = useAdminSites();

  if (isLoading) return <LoadingState label="Loading sites..." />;
  if (isError) return <ErrorState description="Could not load sites." />;

  return (
    <div>
      <AdminPageHeader
        title="Cultural Sites"
        description="Review cultural sites, provider presence, and verification visibility."
      />

      <div className="grid gap-4">
        {data?.map((site) => (
          <AdminListCard
            key={site.id}
            title={site.site_name}
            subtitle={site.description || "No description available."}
            meta={site.verification_status}
          >
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Location: {site.location || "Not set"}</span>
              <span>Followers: {site.followers_count ?? 0}</span>
              <span>Created: {formatDate(site.created_at)}</span>
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}