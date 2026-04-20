
"use client";

import { Users, Globe, Eye, Package, BookOpen, Flag } from "lucide-react";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { StatCard } from "@/src/components/admin/admin-ui";
import { useAdminOverview } from "@/src/features/admin/hooks";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";

export default function AdminOverviewPage() {
  const { data, isLoading, isError } = useAdminOverview();

  if (isLoading) return <LoadingState label="Loading overview..." />;
  if (isError || !data) return <ErrorState description="Could not load admin overview." />;

  const stats = [
    { label: "Users",       value: data.total_users,       icon: Users,    iconColor: "bg-violet-500" },
    { label: "Sites",       value: data.total_sites,       icon: Globe,    iconColor: "bg-blue-500"   },
    { label: "Experiences", value: data.total_experiences, icon: Eye,      iconColor: "bg-amber-400"  },
    { label: "Packages",    value: data.total_packages,    icon: Package,  iconColor: "bg-emerald-500"},
    { label: "Bookings",    value: data.total_bookings,    icon: BookOpen, iconColor: "bg-cyan-500"   },
    { label: "Reports",     value: data.total_reports,     icon: Flag,     iconColor: "bg-red-500"    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="Monitor platform growth, activity, and operational visibility."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

