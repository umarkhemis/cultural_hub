
"use client";

import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminListCard } from "@/src/components/admin/admin-list-card";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useAdminUsers } from "@/src/features/admin/hooks";
import { formatDate } from "@/src/utils/formatDate";

export default function AdminUsersPage() {
  const { data, isLoading, isError } = useAdminUsers();

  if (isLoading) return <LoadingState label="Loading users..." />;
  if (isError) return <ErrorState description="Could not load users." />;

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="View platform users across tourists, providers, and administrators."
      />

      <div className="grid gap-4">
        {data?.map((user) => (
          <AdminListCard
            key={user.id}
            title={user.full_name}
            subtitle={`${user.email}${user.phone ? ` • ${user.phone}` : ""}`}
            meta={user.role}
          >
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Active: {user.is_active ? "Yes" : "No"}</span>
              <span>Verified: {user.is_verified ? "Yes" : "No"}</span>
              <span>Created: {formatDate(user.created_at)}</span>
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}