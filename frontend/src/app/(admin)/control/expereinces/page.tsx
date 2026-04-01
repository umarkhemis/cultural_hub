
"use client";

import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminListCard } from "@/src/components/admin/admin-list-card";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { useAdminExperiences } from "@/src/features/admin/hooks";
import { formatDate } from "@/src/utils/formatDate";

export default function AdminExperiencesPage() {
  const { data, isLoading, isError } = useAdminExperiences();

  if (isLoading) return <LoadingState label="Loading experiences..." />;
  if (isError) return <ErrorState description="Could not load experiences." />;

  return (
    <div>
      <AdminPageHeader
        title="Experiences"
        description="Review published and platform-listed cultural experience content."
      />

      <div className="grid gap-4">
        {data?.map((experience) => (
          <AdminListCard
            key={experience.id}
            title={experience.provider.site_name}
            subtitle={experience.caption}
            meta={experience.status}
          >
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Likes: {experience.likes_count}</span>
              <span>Comments: {experience.comments_count}</span>
              <span>Created: {formatDate(experience.created_at)}</span>
            </div>
          </AdminListCard>
        ))}
      </div>
    </div>
  );
}