
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { PageContainer } from "@/src/components/layout/page-container";
import { ErrorState } from "@/src/components/shared/error-state";
import { LoadingState } from "@/src/components/shared/loading-state";
import { ExperienceActions } from "@/src/features/experiences/experience-actions";
import { ExperienceMediaGallery } from "@/src/features/experiences/experience-media";
import { useExperienceDetail } from "@/src/features/experiences/hooks";
import { formatDate } from "@/src/utils/formatDate";
import { CommentForm } from "@/src/features/experiences/comment-form";
import { CommentList } from "@/src/features/experiences/comment-list";
import { useExperienceComments } from "@/src/features/experiences/tourist-hooks";

export default function ExperienceDetailPage() {
  const params = useParams<{ experienceId: string }>();
  const experienceId = params.experienceId;

  const { data, isLoading, isError } = useExperienceDetail(experienceId);

  if (isLoading) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-4xl">
          <LoadingState label="Loading experience..." />
        </PageContainer>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="bg-slate-50 py-8">
        <PageContainer className="max-w-4xl">
          <ErrorState description="We could not load this experience." />
        </PageContainer>
      </main>
    );
  }

    const {
        data: comments = [],
        isLoading: commentsLoading,
    } = useExperienceComments(experienceId, 20);

  return (
    <main className="bg-slate-50 py-8 sm:py-10">
      <PageContainer className="max-w-4xl">
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-700">
                {data.provider.site_name.slice(0, 2).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/sites/${data.provider.id}`}
                  className="block text-base font-semibold text-slate-900 hover:underline"
                >
                  {data.provider.site_name}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  {data.provider.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {data.provider.location}
                    </span>
                  ) : null}
                  <span>•</span>
                  <span>{formatDate(data.created_at)}</span>
                </div>
              </div>
            </div>

            <ExperienceMediaGallery media={data.media_items} />

            <div className="mt-6 space-y-4">
              <p className="text-sm leading-7 text-slate-700 sm:text-base">
                {data.caption}
              </p>

              <ExperienceActions
                    experienceId={data.id}
                    likesCount={data.likes_count}
                    commentsCount={data.comments_count}
                    likedByCurrentUser={data.liked_by_current_user}
                />
                <div className="space-y-5">
                <CommentForm experienceId={data.id} />

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                    Comments
                    </h2>

                    {commentsLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                        Loading comments...
                    </div>
                    ) : comments.length > 0 ? (
                    <CommentList comments={comments} />
                    ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                        No comments yet. Be the first to join the conversation.
                    </div>
                    )}
              </div>
            </div>
              
            </div>
          </div>
        </article>
      </PageContainer>
    </main>
  );
}