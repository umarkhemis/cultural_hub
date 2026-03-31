
"use client";

import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { useAdminOverview } from "@/src/features/admin/hooks";

export default function AdminOverviewPage() {
  const { data, isLoading, isError } = useAdminOverview();

  if (isLoading) {
    return <LoadingState label="Loading admin overview..." />;
  }

  if (isError || !data) {
    return <ErrorState description="Could not load admin overview." />;
  }

  const cards = [
    ["Users", data.total_users],
    ["Providers", data.total_providers],
    ["Sites", data.total_sites],
    ["Packages", data.total_packages],
    ["Experiences", data.total_experiences],
    ["Bookings", data.total_bookings],
    ["Reports", data.total_reports],
  ];

  return (
    <div>
      <AdminPageHeader
        title="Admin Overview"
        description="Monitor platform growth, activity, and operational visibility."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}