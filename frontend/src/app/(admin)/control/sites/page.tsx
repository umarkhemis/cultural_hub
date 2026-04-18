
"use client";

/**
 * Admin Sites Page
 * Full DataTable with verification toggle, status badge, follower count.
 * Verify / Revoke calls PATCH /admin/sites/:id
 */

import { useState } from "react";
import { BadgeCheck, ShieldOff, ExternalLink, MapPin } from "lucide-react";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import {
  AdminPageHeader, DataTable, AdminBadge, ActionMenu,
} from "@/src/components/admin/admin-ui";
import { useAdminSites } from "@/src/features/admin/hooks";
import { useToastStore } from "@/src/store/toast-store";
import { formatDate } from "@/src/utils/formatDate";
import { apiClient } from "@/src/lib/api/client";
import type { CulturalSite } from "@/src/lib/api/sites";

export default function AdminSitesPage() {
  const { data, isLoading, isError, refetch } = useAdminSites();
  const { addToast } = useToastStore();
  const [processing, setProcessing] = useState<string | null>(null);

  if (isLoading) return <LoadingState label="Loading sites..." />;
  if (isError)   return <ErrorState description="Could not load sites." />;

  const sites = data ?? [];

  const toggleVerification = async (site: CulturalSite) => {
    const newStatus = site.verification_status === "verified" ? "unverified" : "verified";
    setProcessing(String(site.id));
    try {
      await apiClient.patch(`/admin/sites/${site.id}`, {
        verification_status: newStatus,
      });
      addToast({
        type: "success",
        title: newStatus === "verified"
          ? `✓ ${site.site_name} is now verified`
          : `${site.site_name} verification revoked`,
      });
      refetch();
    } catch {
      addToast({ type: "error", title: "Could not update site." });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Cultural Sites"
        description={`${sites.length.toLocaleString()} provider sites registered on the platform.`}
      />

      <DataTable
        data={sites}
        searchKeys={["site_name", "location", "verification_status"] as (keyof CulturalSite)[]}
        searchPlaceholder="Search by name or location..."
        emptyMessage="No sites found."
        columns={[
          {
            key: "site_name",
            label: "Site",
            sortable: true,
            render: (s) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-xs font-bold text-emerald-400 border border-emerald-400/20">
                  {s.site_name?.[0]?.toUpperCase() ?? "S"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white truncate">{s.site_name}</p>
                    {s.verification_status === "verified" && (
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-label="Verified" />
                    )}
                  </div>
                  {s.location && (
                    <p className="flex items-center gap-1 text-xs text-slate-500 truncate">
                      <MapPin className="h-2.5 w-2.5 shrink-0" />
                      {s.location}
                    </p>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "verification_status",
            label: "Verification",
            sortable: true,
            render: (s) => <AdminBadge value={s.verification_status ?? "unverified"} />,
          },
          {
            key: "followers_count",
            label: "Followers",
            sortable: true,
            hideOnMobile: true,
            render: (s) => (
              <span className="text-sm font-medium text-slate-300">
                {(s.followers_count ?? 0).toLocaleString()}
              </span>
            ),
          },
          {
            key: "created_at",
            label: "Created",
            sortable: true,
            hideOnMobile: true,
            render: (s) => <span className="text-xs text-slate-500">{formatDate(s.created_at)}</span>,
          },
          {
            key: "actions",
            label: "",
            render: (s) => (
              <ActionMenu items={[
                {
                  label: "View site",
                  icon: ExternalLink,
                  onClick: () => window.open(`/sites/${s.id}`, "_blank"),
                },
                s.verification_status === "verified"
                  ? {
                      label: "Revoke verification",
                      icon: ShieldOff,
                      onClick: () => toggleVerification(s),
                      destructive: true,
                    }
                  : {
                      label: "Grant verification",
                      icon: BadgeCheck,
                      onClick: () => toggleVerification(s),
                    },
              ]} />
            ),
          },
        ]}
      />
    </div>
  );
}