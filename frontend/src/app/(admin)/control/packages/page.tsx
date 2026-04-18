
"use client";

import { ExternalLink, EyeOff } from "lucide-react";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import { AdminPageHeader, DataTable, AdminBadge, ActionMenu, StatCard } from "@/src/components/admin/admin-ui";
import { useAdminPackages } from "@/src/features/admin/hooks";
import { useToastStore } from "@/src/store/toast-store";
import { formatDate } from "@/src/utils/formatDate";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { Package, DollarSign } from "lucide-react";

export default function AdminPackagesPage() {
  const { data, isLoading, isError } = useAdminPackages();
  const { addToast } = useToastStore();

  if (isLoading) return <LoadingState label="Loading packages..." />;
  if (isError)   return <ErrorState description="Could not load packages." />;

  const packages = data ?? [];

  const avgPrice = packages.length > 0
    ? packages.reduce((acc, p) => acc + (p.price ?? 0), 0) / packages.length
    : 0;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Packages"
        description={`${packages.length.toLocaleString()} tourism packages available on the platform.`}
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Packages" value={packages.length} icon={Package}     iconColor="bg-violet-500" />
        <StatCard label="Average Price"  value={formatCurrency(avgPrice)} icon={DollarSign} iconColor="bg-emerald-500" />
      </div>

      <DataTable
        data={packages}
        searchKeys={["package_name", "status"] as never[]}
        searchPlaceholder="Search by package name..."
        emptyMessage="No packages found."
        columns={[
          {
            key: "package_name",
            label: "Package",
            sortable: true,
            render: (p) => (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate max-w-[180px]">{p.package_name}</p>
                <p className="text-xs text-slate-500 truncate max-w-[180px]">{p.provider?.site_name ?? "—"}</p>
              </div>
            ),
          },
          {
            key: "status",
            label: "Status",
            sortable: true,
            render: (p) => <AdminBadge value={p.status ?? "published"} />,
          },
          {
            key: "price",
            label: "Price",
            sortable: true,
            render: (p) => (
              <span className="text-sm font-semibold text-white">{formatCurrency(p.price)}</span>
            ),
          },
          {
            key: "duration",
            label: "Duration",
            hideOnMobile: true,
            render: (p) => (
              <span className="text-xs text-slate-400">{p.duration || "—"}</span>
            ),
          },
          {
            key: "created_at",
            label: "Created",
            sortable: true,
            hideOnMobile: true,
            render: (p) => <span className="text-xs text-slate-500">{formatDate(p.created_at)}</span>,
          },
          {
            key: "actions",
            label: "",
            render: (p) => (
              <ActionMenu items={[
                {
                  label: "View package",
                  icon: ExternalLink,
                  onClick: () => window.open(`/packages/${p.id}`, "_blank"),
                },
                {
                  label: "Unpublish",
                  icon: EyeOff,
                  onClick: () => addToast({ type: "success", title: "Package unpublished (connect API)" }),
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