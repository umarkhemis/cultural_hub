
"use client";

/**
 * Admin Users Page
 * Full DataTable with sortable columns, search, role filter,
 * and per-row actions: view profile, suspend, change role.
 */

import { UserX, UserCheck, ExternalLink } from "lucide-react";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ErrorState } from "@/src/components/shared/error-state";
import {
  AdminPageHeader, DataTable, AdminBadge, ActionMenu, Avatar,
} from "@/src/components/admin/admin-ui";
import { useAdminUsers } from "@/src/features/admin/hooks";
import { useToastStore } from "@/src/store/toast-store";
import { formatDate } from "@/src/utils/formatDate";
import type { AdminUser } from "@/src/lib/api/admin";

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useAdminUsers();
  const { addToast } = useToastStore();

  if (isLoading) return <LoadingState label="Loading users..." />;
  if (isError)   return <ErrorState description="Could not load users." />;

  const users = data ?? [];

  const handleSuspend = (user: AdminUser) => {
    // TODO: call PATCH /admin/users/:id { is_active: false }
    addToast({ type: "success", title: `${user.full_name} suspended` });
  };

  const handleActivate = (user: AdminUser) => {
    // TODO: call PATCH /admin/users/:id { is_active: true }
    addToast({ type: "success", title: `${user.full_name} activated` });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description={`${users.length.toLocaleString()} registered accounts across all roles.`}
      />

      <DataTable
        data={users}
        searchKeys={["full_name", "email", "role"]}
        searchPlaceholder="Search by name, email, or role..."
        emptyMessage="No users found."
        columns={[
          {
            key: "full_name",
            label: "User",
            sortable: true,
            render: (u) => (
              <div className="flex items-center gap-2.5">
                <Avatar name={u.full_name || "?"} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{u.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: "role",
            label: "Role",
            sortable: true,
            render: (u) => <AdminBadge value={u.role} />,
          },
          {
            key: "is_active",
            label: "Status",
            render: (u) => (
              <AdminBadge value={u.is_active ? "active" : "inactive"} />
            ),
          },
          {
            key: "is_verified",
            label: "Verified",
            hideOnMobile: true,
            render: (u) => (
              <span className={`text-xs font-semibold ${u.is_verified ? "text-emerald-400" : "text-slate-600"}`}>
                {u.is_verified ? "Yes" : "No"}
              </span>
            ),
          },
          {
            key: "phone",
            label: "Phone",
            hideOnMobile: true,
            render: (u) => <span className="text-xs text-slate-500">{u.phone ?? "—"}</span>,
          },
          {
            key: "created_at",
            label: "Joined",
            sortable: true,
            hideOnMobile: true,
            render: (u) => <span className="text-xs text-slate-500">{formatDate(u.created_at)}</span>,
          },
          {
            key: "actions",
            label: "",
            render: (u) => (
              <ActionMenu items={[
                {
                  label: "View profile",
                  icon: ExternalLink,
                  onClick: () => window.open(`/profile/${u.id}`, "_blank"),
                },
                u.is_active
                  ? { label: "Suspend user", icon: UserX, onClick: () => handleSuspend(u), destructive: true }
                  : { label: "Activate user", icon: UserCheck, onClick: () => handleActivate(u) },
              ]} />
            ),
          },
        ]}
      />
    </div>
  );
}