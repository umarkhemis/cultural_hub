
"use client";

import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminListCard } from "@/src/components/admin/admin-list-card";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useAdminPackages } from "@/src/features/admin/hooks";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { formatDate } from "@/src/utils/formatDate";

export default function AdminPackagesPage() {
  const { data, isLoading, isError } = useAdminPackages();

  if (isLoading) return <LoadingState label="Loading packages..." />;
  if (isError) return <ErrorState description="Could not load packages." />;

  return (
    <div>
      <AdminPageHeader
        title="Packages"
        description="Review available provider packages and pricing visibility."
      />

      <div className="grid gap-4">
        {data?.map((item) => (
          <AdminListCard
            key={item.id}
            title={item.package_name}
            subtitle={`${item.provider.site_name} • ${item.description}`}
            meta={item.status}
          >
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Price: {formatCurrency(item.price)}</span>
              <span>Duration: {item.duration || "Not set"}</span>
              <span>Created: {formatDate(item.created_at)}</span>
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}